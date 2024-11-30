import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Firestore 인스턴스 가져오기
import firebase from 'firebase/app';
import './myproject.css';

function MyProject() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departmentData, setDepartmentData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      db.collection('tasks')
        .where('Usersid', '==', currentUserId)
        .get()
        .then((snapshot) => {
          const fetchedTasks = snapshot.docs.map((doc) => {
            const taskData = doc.data();
            const category = departmentData.categories.find(
              (cat) => cat.name === taskData.categoriesName
            );
            const subcategory = category.subcategories.find(
              (sub) => sub.name === taskData.subcategoriesName
            );
  
            return {
              id: doc.id,
              ...taskData,
              availableSubcategories: category.subcategories || [],
              availableSubSubcategories: subcategory.subsubcategories || [],
            };
          });
          setTasks(fetchedTasks);
        })
        .catch((error) => console.error('Error fetching tasks:', error));
    }
  }, [currentUserId, departmentData]);
  
  useEffect(() => {
    db.collection('departments')
      .doc('business')
      .get()
      .then((doc) => {
        if (doc.exists) {
          setDepartmentData(doc.data());
        } else {
          console.error('No such document!');
        }
      })
      .catch((error) => console.error('Error fetching department data:', error));
  }, []);

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

    // 동기화 useEffect 추가
    useEffect(() => {
      tasks.forEach((task) => {
        const baseTime = task.baseTime || 0;
        const spentTime = parseFloat(task.spentTime) || 0;
        const remainingTime = baseTime - spentTime;
  
        // 상태값 계산
        const updatedStatus =
          task.status === '완료'
            ? '완료'
            : remainingTime < 0
            ? '지연'
            : '할일';
  
        // Firebase 동기화
        if (task.remainingTime !== remainingTime || task.status !== updatedStatus) {
          db.collection('tasks')
            .doc(task.id)
            .update({ remainingTime, status: updatedStatus })
            .then(() =>
              console.log(`Updated task: ${task.id}, Remaining Time: ${remainingTime}, Status: ${updatedStatus}`)
            )
            .catch((error) => console.error('Error updating task:', error));
        }
      });
    }, [tasks]);

  const updateTaskField = (taskId, field, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              [field]: value,
              ...(field === 'categoriesName' && {
                subcategoriesName: task.categoriesName === value ? task.subcategoriesName : '',
                subsubcategoriesName: task.categoriesName === value ? task.subsubcategoriesName : '',
                availableSubcategories:
                  departmentData.categories.find(
                    (category) => category.name === value
                  ).subcategories || [],
                availableSubSubcategories: [],
              }),
              ...(field === 'subcategoriesName' && {
                subsubcategoriesName: task.subcategoriesName === value ? task.subsubcategoriesName : '',
                availableSubSubcategories:
                  task.availableSubcategories.find(
                    (subcategory) => subcategory.name === value
                  ).subsubcategories || [],
              }),
              ...(field === 'spentTime' && {
                remainingTime: (() => {
                  const baseTime = task.baseTime || 0; // 기준 시간
                  const spentTime = Math.max(0, parseFloat(value)) || 0; // 소요 시간
                  return baseTime - spentTime;
                })(),
                status: (() => {
                  const baseTime = task.baseTime || 0;
                  const spentTime = Math.max(0, parseFloat(value)) || 0;
                  const remainingTime = baseTime - spentTime;
  
                  // 상태 변경 로직
                  if (remainingTime < 0) return '지연'; // 잔여 시간이 음수일 경우 '지연'
                  if (task.status === '완료') return '완료'; // 상태가 이미 '완료'일 경우 유지
                  return '할일'; // 기본 상태
                })(),
              }), 
            }
          : task
      )
    );
    
     // Firestore 업데이트
  const currentTask = tasks.find((task) => task.id === taskId);
  const baseTime = currentTask.baseTime || 0; // 기준 시간
  const spentTime =
    field === 'spentTime' ? Math.max(0, parseFloat(value)) || 0 : currentTask.spentTime || 0; // 소요 시간
  const remainingTime = baseTime - spentTime;

  const updateData = {
    [field]: value,
    ...(field === 'spentTime' && {
      remainingTime,
      status: remainingTime < 0 ? '지연' : currentTask.status === '완료' ? '완료' : '할일',
    }),
  };
 
    db.collection('tasks')
      .doc(taskId)
      .update(updateData)
      .then(() => console.log(`Task ${taskId} updated: ${field} = ${value}`))
      .catch((error) => console.error('Error updating task:', error));
  };
  

  const addTask = () => {
    if (!currentUserId) {
      console.error('사용자가 로그인되지 않았습니다.');
      return;
    }

    const newTask = {
      date: new Date().toISOString().split('T')[0],
      status: '할일',
      projectName: '',
      categoriesName: '',
      subcategoriesName: '',
      subsubcategoriesName: '',
      baseTime: 0,
      spentTime: 0,
      remainingTime: 0,
      note: '',
      Usersid: currentUserId,
      availableSubcategories: [],
      availableSubSubcategories: [],
    };

    db.collection('tasks')
      .add(newTask)
      .then((docRef) => {
        setTasks((prevTasks) => [
          ...prevTasks,
          { id: docRef.id, ...newTask },
        ]);
        console.log('Task added:', docRef.id);
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const deleteTask = (taskId) => {
    db.collection('tasks')
      .doc(taskId)
      .delete()
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        console.log('Task deleted:', taskId);
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
        <div>기준시간</div>
        <div>소요시간</div>
        <div>잔여시간</div>
        <div>비고</div>
      </div>
      <div className="task-sections">
        {['할일', '지연', '진행중', '완료'].map((status) => (
          <div className="task-section" key={status}>
            <h3>▼ {status}</h3>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div className={`task-row ${task.status}`} key={task.id}>
                  <div>{task.date}</div>
                  <div>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskField(task.id, 'status', e.target.value)
                      }
                      className={`status-select ${task.status}`}
                    >
                      <option value="할일">할일</option>
                      <option value="지연">지연</option>
                      <option value="진행중">진행중</option>
                      <option value="완료">완료</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={task.projectName}
                      onChange={(e) =>
                        updateTaskField(task.id, 'projectName', e.target.value)
                      }
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
                      onChange={(e) =>
                        updateTaskField(task.id, 'categoriesName', e.target.value)
                      }
                      className="category-select"
                    >
                      <option value="">대분류</option>
                      {departmentData.categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={task.subcategoriesName}
                      onChange={(e) =>
                        updateTaskField(
                          task.id,
                          'subcategoriesName',
                          e.target.value
                        )
                      }
                      className="category-select 중분류"
                    >
                      <option value="">중분류</option>
                      {task.availableSubcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={task.subsubcategoriesName}
                      onChange={(e) =>
                        updateTaskField(
                          task.id,
                          'subsubcategoriesName',
                          e.target.value
                        )
                      }
                      className="category-select 소분류"
                    >
                      <option value="">소분류</option>
                      {task.availableSubSubcategories.map((subSubcategory) => (
                        <option
                          key={subSubcategory.id}
                          value={subSubcategory.name}
                        >
                          {subSubcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                  {task.availableSubSubcategories
                    .filter(
                      (subSubcategory) =>
                        subSubcategory.name === task.subsubcategoriesName
                    )
                    .map((subSubcategory) => {
                      const baseTime = subSubcategory.baseTime || 0;

                      // 서버 업데이트
                      if (task.baseTime !== baseTime) {
                        updateTaskField(task.id, 'baseTime', baseTime);
                      }

                      return (
                        <span key={subSubcategory.id}>{baseTime}</span>
                      );
                    })}
                  </div>
                  <div>
                    <input
                      type="number"
                      value={task.spentTime}
                      onChange={(e) =>
                        updateTaskField(task.id, 'spentTime', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <span
                        style={{
                          color: task.status === '완료' ? 'blue' : task.remainingTime < 0 ? 'red' : 'black',
                        }}
                      >
                        {task.status === '완료'
                          ? '완료'
                          : task.remainingTime < 0
                          ? '지연'
                          : task.remainingTime}
                      </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={task.note}
                      onChange={(e) =>
                        updateTaskField(task.id, 'note', e.target.value)
                      }
                    />
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete-icon-button"
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
