// accounting.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import '../styles/accounting.css';
import { collection, doc, addDoc, deleteDoc, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from '@/lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { User } from 'firebase/auth';


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
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });
        // Cleanup listener
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                // 使用者登入時，才去取得紀錄
                if (currentUser) {
                    const userRef = doc(db, 'users', currentUser.uid);
                    const recordsCollectionRef = collection(userRef, 'records');
                    const querySnapshot = await getDocs(recordsCollectionRef);
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
                }
            } catch (error) {
                console.error("Error fetching records:", error);
            }
        };
        fetchRecords();
    }, [currentUser]);

    const addRecord = async () => {
        try {
            if (!currentUser) {
                console.error("No current user found");
                return;
            }

            const adjustedAmount = type === "收入" ? amount : -amount;
            const newRecord = { type, amount: adjustedAmount, description };

            // 保存紀錄時，根據當前使用者的uid
            const userRef = doc(db, 'users', currentUser.uid);
            const recordsCollectionRef = collection(userRef, 'records');
            const recordRef = await addDoc(recordsCollectionRef, newRecord);

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
            if (!currentUser) {
                console.error("No current user found");
                return;
            }

            await deleteDoc(doc(db, `users/${currentUser.uid}/records`, recordId));
            setRecords(records.filter(record => record.id !== recordId));
        } catch (error) {
            console.error("Error deleting record:", error);
        };
    }

    const getTotal = (): number => {
        return records.reduce((total, record) => total + record.amount, 0);
    };

    if (!currentUser) {
        return (
            <div>
                Please <a href="/signin">Sign In</a> to access the accounting page.
            </div>
        );
    }

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