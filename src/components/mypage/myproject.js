import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Firestore 인스턴스 가져오기
import firebase from 'firebase/app';
import './myproject.css';

function MyProject() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]); // 프로젝트 데이터를 저장할 상태
  const [categories, setCategories] = useState([]); // 대분류 데이터 저장
  const [subcategories, setsubCategories] = useState([]); // 중분류 데이터 저장
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newTask, setNewTask] = useState({
    date: new Date().toISOString().split('T')[0],
    status: '할일',
    projectName: '',
    categoriesName: '',
    subcategoriesName: '',
    category3: '',
    baseTime: 0,
    spentTime: 0,
    remainingTime: 0,
    note: '',
    Usersid: '', // 사용자 ID 필드
  });

  // 현재 로그인된 사용자 ID 가져오기
  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setCurrentUserId(user.uid);
      setNewTask((prevTask) => ({
        ...prevTask,
        Usersid: user.uid,
      }));
    }
  }, []);

  // Firestore에서 작업 데이터 로드
  useEffect(() => {
    if (currentUserId) {
      db.collection('tasks')
        .where('Usersid', '==', currentUserId)
        .get()
        .then((snapshot) => {
          const fetchedTasks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(fetchedTasks);
        })
        .catch((error) => console.error('Error fetching tasks:', error));
    }
  }, [currentUserId]);

  // Firestore에서 프로젝트 데이터 로드
  useEffect(() => {
    db.collection('projects')
      .get()
      .then((snapshot) => {
        const fetchedProjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setProjects(fetchedProjects);
      })
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  // Firestore에서 카테고리 대분류 데이터 로드
  useEffect(() => {
    db.collection('categories')
      .get()
      .then((snapshot) => {
        const fetchedcategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(fetchedcategories);
      })
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  // Firestore에서 카테고리 중분류 데이터 로드
  useEffect(() => {
    db.collection('subcategories')
      .get()
      .then((snapshot) => {
        const fetchedsubcategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setsubCategories(fetchedsubcategories);
      })
      .catch((error) => console.error('Error fetching subcategories:', error));
  }, []);

  const handleTaskInputChange = (field, value) => {
    const updatedTask = { ...newTask, [field]: value };

    if (field === 'spentTime' || field === 'baseTime') {
      const baseTime = field === 'baseTime' ? parseFloat(value) || 0 : newTask.baseTime;
      const spentTime = field === 'spentTime' ? parseFloat(value) || 0 : newTask.spentTime;
      updatedTask.remainingTime = baseTime - spentTime;
    }

    setNewTask(updatedTask);
  };

  const addTask = () => {
    if (!currentUserId) {
      console.error('사용자가 로그인되지 않았습니다.');
      return;
    }

    const taskToAdd = { ...newTask, Usersid: currentUserId };

    db.collection('tasks')
      .add(taskToAdd)
      .then((docRef) => {
        console.log('Task added with ID:', docRef.id);
        setTasks((prevTasks) => [...prevTasks, { id: docRef.id, ...taskToAdd }]);
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const updateTaskField = (taskId, field, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, [field]: value } : task))
    );

    db.collection('tasks')
      .doc(taskId)
      .update({ [field]: value })
      .then(() => console.log('Task updated:', taskId))
      .catch((error) => console.error('Error updating task:', error));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    updateTaskField(taskId, 'status', newStatus);
  };

  const deleteTask = (taskId) => {
    db.collection('tasks')
      .doc(taskId)
      .delete()
      .then(() => {
        console.log('Task deleted:', taskId);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  return (
    <div className="my-project">
      <div className="project-header">
        <button onClick={addTask}>+ 작업 추가</button>
      </div>
      <div className="task-table-header">
        <div>작성일</div>
        <div>상태</div>
        <div>사업명</div>
        <div>대분류</div>
        <div>중분류</div>
        <div>소분류</div>
        <div>기준 시간</div>
        <div>소요 시간</div>
        <div>잔여 시간</div>
        <div>비고</div>
      </div>
      <div className="task-sections">
        {['할일', '지연', '진행중', '완료'].map((status) => (
          <div className="task-section" key={status}>
            <h3>▼ {status}</h3>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div className={`task-row ${task.projectName.replace(' ', '-')} ${task.status}`} key={task.id}>
                  <div>{task.date}</div>
                  <div>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className={`status-select ${task.status}`}
                    >
                      <option value="할일">● 할일</option>
                      <option value="지연">● 지연</option>
                      <option value="진행중">● 진행중</option>
                      <option value="완료">● 완료</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={task.projectName}
                      onChange={(e) => updateTaskField(task.id, 'projectName', e.target.value)}
                      className={`project-select ${task.projectName}`}
                    >
                      <option value="">사업명</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.name}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={task.categoriesName}
                      onChange={(e) => updateTaskField(task.id, 'categoriesName', e.target.value)}
                      className={`category-select ${task.categoriesName}`}
                    >
                      <option value="">대분류</option>
                      {categories.map((categories) => (
                        <option key={categories.id} value={categories.name}>
                          {categories.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                        value={task.subcategoriesName}
                        onChange={(e) => updateTaskField(task.id, 'subcategoriesName', e.target.value)}
                        className={`category-select ${task.subcategoriesName}`}
                      >
                        <option value="">중분류</option>
                        {subcategories.map((subcategories) => (
                          <option key={subcategories.id} value={subcategories.name}>
                            {subcategories.name}
                          </option>
                        ))}
                      </select>
                  </div>
                  <div>{task.category3}</div>
                  <div>{task.baseTime}</div>
                  <div>
                    <input
                      type="number"
                      value={task.spentTime}
                      onChange={(e) => updateTaskField(task.id, 'spentTime', e.target.value)}
                    />
                  </div>
                  <div>{task.remainingTime}</div>
                  <div>
                    <input
                      type="text"
                      value={task.note}
                      onChange={(e) => updateTaskField(task.id, 'note', e.target.value)}
                    />
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete-icon-button"
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProject;
