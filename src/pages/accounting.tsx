// accounting.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import '../styles/accounting.css';
import { collection, doc, addDoc, deleteDoc, getDocs, QueryDocumentSnapshot } from "firebase/firestore"; // 加入 getDocs
import db from '../app/firebase';

type RecordType = '收入' | '支出';

type Record = {
    id?: string;
    type: RecordType;
    amount: number;
    description: string;
};

export default function Accounting() {
    const [type, setType] = useState<RecordType>("收入");
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [records, setRecords] = useState<Record[]>([]);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'records'));
                const fetchedRecords: Record[] = [];
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    fetchedRecords.push({
                        id: doc.id,
                        type: data.type,
                        amount: data.amount,
                        description: data.description,
                    });
                });
                setRecords(fetchedRecords);
            } catch (error) {
                console.error("Error fetching records:", error);
            }
        };
        fetchRecords();
    }, []);

    const addRecord = async () => {
        try {
            const adjustedAmount = type === "收入" ? amount : -amount;
            const newRecord = { type, amount: adjustedAmount, description };

            const recordRef = await addDoc(collection(db, 'records'), newRecord);
            const completeRecord = { ...newRecord, id: recordRef.id };

            setRecords([...records, completeRecord]);
            setAmount(0);
            setDescription("");

        } catch (error) {
            console.error("Error adding record:", error);
        }
    };

    const deleteRecord = async (recordId: string) => {
        try {
            await deleteDoc(doc(db, 'records', recordId));
            setRecords(records.filter(record => record.id !== recordId));
        } catch (error) {
            console.error("Error deleting record:", error);
        };
    }

    const getTotal = (): number => {
        return records.reduce((total, record) => total + record.amount, 0);
    };

    return (
        <div>
            <div className="input-section">
                <select
                    className="dropdown"
                    value={type}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value as RecordType)}>
                    <option value="收入">收入</option>
                    <option value="支出">支出</option>
                </select>
                <input
                    type="number"
                    className="number-input"
                    value={amount}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
                    placeholder="金額"
                />
                <input
                    type="text"
                    className="text-input"
                    value={description}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                    placeholder="說明"
                />
                <button className="add-button" onClick={addRecord}>新增紀錄</button>
            </div>
            <div>
                {records.map((record, index) => (
                    <div className="record-item" key={index}>
                        <span className="record-amount" style={{ color: record.amount > 0 ? 'green' : 'red' }}>
                            {record.amount}
                        </span>
                        <span className="record-description">{record.description}</span>
                        <button className="delete-button" onClick={() => deleteRecord(record.id!)}>刪除</button>
                    </div>
                ))}
            </div>
            <div className="total-section">
                <strong>小計：</strong>{getTotal()}
            </div>
            <button className="home-button" onClick={() => window.location.href = "/"}>返回首頁</button>
        </div>
    );
}