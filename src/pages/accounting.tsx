import React, { useState, ChangeEvent } from 'react';
import '../styles/accounting.css';

type RecordType = '收入' | '支出';

type Record = {
    type: RecordType;
    amount: number;
    description: string;
};

export default function Accounting() {
    const [type, setType] = useState<RecordType>("收入");
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>("");
    const [records, setRecords] = useState<Record[]>([]);

    const addRecord = () => {
        const adjustedAmount = type === "收入" ? amount : -amount;
        setRecords([...records, { type, amount: adjustedAmount, description }]);
        setAmount(0);
        setDescription("");
    };

    const deleteRecord = (indexToDelete: number) => {
        setRecords(records.filter((_, index) => index !== indexToDelete));
    };

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
                <button className="add-btn" onClick={addRecord}>新增紀錄</button>
            </div>
            <div>
                {records.map((record, index) => (
                    <div className="record-item" key={index}>
                        <span className="record-amount" style={{ color: record.amount > 0 ? 'green' : 'red' }}>
                            {record.amount}
                        </span>
                        <span className="record-description">{record.description}</span>
                        <button className="delete-btn" onClick={() => deleteRecord(index)}>刪除</button>
                    </div>
                ))}
            </div>
            <div className="total-section">
                <strong>小計：</strong>{getTotal()}
            </div>
            <button className="home-btn" onClick={() => window.location.href = "/"}>返回首頁</button>
        </div>
    );
}