import React, {useState} from 'react';
import firebase from 'firebase/app'; // Firebase 초기화 가져오기
import 'firebase/firestore'; // Firestore 서비스 가져오기
import './addLegodata.css'; // CSS 파일 추가

function AddLegoData() {
    const [taskData, setTaskData] = useState([]);
    const CACHE_KEY = 'totaladmin_tasks';
    const CACHE_TIMESTAMP_KEY = 'totaladmin_timestamp';

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        let allData = [];

        for (const file of files) {
            const data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const json = JSON.parse(e.target.result);
                        resolve(json);
                    } catch (err) {
                        console.error(`JSON 파싱 오류 (${file.name}):`, err);
                        reject(err);
                    }
                };
                reader.readAsText(file);
            });
            
            // 배열인 경우 spread operator로 추가, 객체인 경우 배열에 추가
            if (Array.isArray(data)) {
                allData = [...allData, ...data];
            } else {
                allData.push(data);
            }
        }

        // 모든 데이터를 로컬 스토리지에 저장
        localStorage.setItem(CACHE_KEY, JSON.stringify(allData));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().getTime().toString());
        setTaskData(allData);
        console.log(`총 ${allData.length}개의 데이터가 로컬 스토리지에 저장되었습니다.`);
    };

    // Firestore에 데이터를 추가하는 함수
    const addTaskData = async () => {
        try {
            const db = firebase.firestore(); // Firestore 인스턴스 가져오기
            const tasksCollection = db.collection('tasks'); // 'tasks' 컬렉션 참조

            for (const task of taskData) {
                // Firestore에 문서 추가 (문서 ID는 자동 생성)
                await tasksCollection.add(task);
            }

            console.log('Task data added successfully!');
        } catch (error) {
            console.error('Error adding task data:', error);
        }
    };

    return (
        <div className="add-task-container">
            <input type="file" accept=".json" multiple onChange={handleFileUpload} />
            <button className="add-task-button" onClick={addTaskData}>
                Add Task
            </button>
        </div>
    );
}

export default AddLegoData;
