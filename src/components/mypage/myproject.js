import React, { useRef,useState, useEffect } from 'react';
import Select from 'react-select';
import { db } from '../../firebase'; // Firestore 인스턴스 가져오기
import firebase from 'firebase/app';
import { debounce } from 'lodash'; // lodash 라이브러리 활용 241217
import Calendar from 'react-calendar'; // react-calendar import
import 'react-calendar/dist/Calendar.css'; // react-calendar css import
import './myproject.css';

function MyProject() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departmentData, setDepartmentData] = useState({ categories: [] });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState(null); // 사용자 정보 저장

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  // Calendar 상태
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setCurrentUserId(user.uid);
    }
  }, []);

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    if (currentUserId) {
      db.collection('Users')
        .doc(currentUserId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.error('사용자 정보를 찾을 수 없습니다.');
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      // 시작일과 종료일을 YYYY-MM-DD 형식으로 변환
      const startOfMonth = new Date(filters.year, filters.month - 1, 1)
        .toISOString()
        .split('T')[0];
      const endOfMonth = new Date(filters.year, filters.month, 0)
        .toISOString()
        .split('T')[0];

      db.collection('tasks')
        .where('Usersid', '==', currentUserId)
        .where('date', '>=', startOfMonth)
        .where('date', '<=', endOfMonth)
        .get()
        .then((snapshot) => {
          const fetchedTasks = snapshot.docs.map((doc) => {
            const taskData = doc.data();
            const category = departmentData.categories.find(
              (cat) => cat.name === taskData.categoriesName
            );
            const subcategory = category
              ? category.subcategories.find(
                  (sub) => sub.name === taskData.subcategoriesName
                )
              : null;
  
            return {
              id: doc.id,
              ...taskData,
              availableSubcategories: category ? category.subcategories : [],
              availableSubSubcategories: subcategory
                ? subcategory.subsubcategories
                : [],
              userName: userData.UserName || '알 수 없음', // 사용자 이름 추가
              userTeam: userData.UserTeam || '알 수 없음', // 사용자 팀 추가
            };
          });
          setTasks(fetchedTasks); // 상태 업데이트
        })
        .catch((error) => console.error('Error fetching tasks:', error));
    }
  }, [currentUserId, departmentData, filters, userData]);
  
  
  useEffect(() => {
    if(userData && userData.isRole ){
      let documentName = '';

      switch(userData.isRole){
        case '1':
          documentName = 'business';
          break;
        case '2':
          documentName = 'Management';
          break;
        case '3':
          documentName = 'Design';
          break;

        default:
          console.error('잘못된 사용자 역할입니다.',userData.isRole);
          return; 
      }
      db.collection('departments')
      .doc(documentName)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setDepartmentData(doc.data());
        } else {
          console.error('No such document!');
        }
      })
      .catch((error) => console.error('Error fetching department data:', error));
      
    }
  }, [userData]);

  useEffect(() => {
    db.collection('projects')
      .get()
      .then((snapshot) => {
        const fetchedProjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        // React-Select의 options 형식으로 변환
        const formattedOptions = fetchedProjects.map((project) => ({
          value: project.name, // value 필드
          label: project.name, // label 필드 (검색 및 표시용)
        }));
        setProjects(formattedOptions);
      })
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

    // 동기화 useEffect 추가
    useEffect(() => {
      tasks.forEach((task) => {
        const baseTime = task.baseTime || 0;
        const spentTime = parseFloat(task.spentTime) || 0;
        const remainingTime = baseTime - spentTime;
  
        // 상태를 덮어쓰지 않고 현재 상태 유지
        const updatedStatus =
        task.status === '완료'
          ? '완료'
          : remainingTime < 0
          ? '지연'
          : task.status; // 기존 상태 유지
  
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

    // Debounced 함수는 컴포넌트가 마운트될 때 단 한 번만 생성됨
    const debouncedUpdateRef = useRef(
    debounce((taskId, updateData) => {
      db.collection('tasks')
        .doc(taskId)
        .update(updateData)
        .then(() => console.log(`Task ${taskId} updated`))
        .catch((error) => console.error('Error updating task:', error));
    }, 500) // 0.5초 후에만 실행
    );

    const handleFilterChange = (field, value) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const updateTaskField = (taskId, field, value) => {
      const currentTask = tasks.find((task) => task.id === taskId);
    
      // 상태를 '지연'으로 변경할 때, note(사유)가 반드시 필요
      if (field === 'status' && value === '지연' && !currentTask.note.trim()) {
        alert('사유를 입력해야 상태를 "지연"으로 변경할 수 있습니다.');
        return;
      }
    
      // '지연' 상태에서 다른 상태로 변경하려고 할 때 note(사유)가 필요
      if (currentTask.status === '지연' && field === 'status' && value !== '지연') {
        if (!currentTask.note.trim()) {
          alert('사유를 입력해야 "지연" 상태에서 다른 상태로 변경할 수 있습니다.');
          return;
        }
      }
    
      // '지연' 상태일 때 다른 필드를 수정할 때 note(사유)가 반드시 필요
      if (currentTask.status === '지연' && field !== 'note' && !currentTask.note.trim()) {
        alert('사유를 입력해야 다른 필드를 수정할 수 있습니다.');
        return;
      }
    
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                [field]: value,
                ...(field === 'categoriesName' && {
                  subcategoriesName: '',
                  subsubcategoriesName: '',
                  availableSubcategories:
                    departmentData.categories.find((category) => category.name === value)
                      .subcategories || [],
                  availableSubSubcategories: [],
                }),
                ...(field === 'subcategoriesName' && {
                  subsubcategoriesName: '',
                  availableSubSubcategories:
                    currentTask.availableSubcategories.find(
                      (subcategory) => subcategory.name === value
                    ).subsubcategories || [],
                }),
                ...(field === 'spentTime' && {
                  remainingTime: (() => {
                    const baseTime = currentTask.baseTime || 0;
                    const spentTime = Math.max(0, parseFloat(value)) || 0;
                    return baseTime - spentTime;
                  })(),
                  status: (() => {
                    const baseTime = currentTask.baseTime || 0;
                    const spentTime = Math.max(0, parseFloat(value)) || 0;
                    const remainingTime = baseTime - spentTime;
    
                    if (remainingTime < 0) return '지연';
                    if (task.status === '완료') return '완료';
                    return '할일';
                  })(),
                }),
              }
            : task
        )
      );
    
      // Firestore 업데이트 (note 필드만 디바운스 적용)
      if (field === 'note') {
        debouncedUpdateRef.current(taskId, { [field]: value });
      } else {
        const baseTime = currentTask.baseTime || 0;
        const spentTime =
          field === 'spentTime' ? Math.max(0, parseFloat(value)) || 0 : currentTask.spentTime || 0;
        const remainingTime = baseTime - spentTime;
    
        const updateData = {
          [field]: value,
          ...(field === 'spentTime' && {
            remainingTime,
            status:
              remainingTime < 0
                ? '지연'
                : currentTask.status === '완료'
                ? '완료'
                : '진행중',
          }),
        };
    
        db.collection('tasks')
          .doc(taskId)
          .update(updateData)
          .then(() => console.log(`Task ${taskId} updated: ${field} = ${value}`))
          .catch((error) => console.error('Error updating task:', error));
      }
    };  

  const addTask = () => {
    if (!currentUserId) {
      console.error('사용자가 로그인되지 않았습니다.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const newTask = {
      date: today,  // 현재 날짜로 설정
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
      userName: userData.UserName,
      userTeam: userData.UserTeam,
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

  // Calendar 관련 함수들 추가
  const handleDateClick = (taskId, event) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    setSelectedTaskId(taskId);
    setIsCalendarOpen(true);
    
    const rect = event.target.getBoundingClientRect();
    setCalendarPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });
  };

  const handleDateChange = (date) => {
    if (selectedTaskId) {
      const formattedDate = date.toISOString().split('T')[0];
      updateTaskField(selectedTaskId, 'date', formattedDate);
      setIsCalendarOpen(false);
    }
  };

  // useEffect 추가
  useEffect(() => {
    const handleClickOutside = (event) => {
      // calendar-container 클래스를 가진 요소를 찾습니다
      const calendarContainer = document.querySelector('.calendar-container');
      
      // 클릭된 요소가 캘린더 컨테이너 밖에 있고, 캘린더가 열려있는 경우
      if (calendarContainer && !calendarContainer.contains(event.target) && 
          !event.target.closest('.myproject-task-row div:first-child')) {
        setIsCalendarOpen(false);
      }
    };

    // 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="my-project">
      <div className="myproject-project-header">
        <button onClick={addTask}>+ 작업 추가</button>
        <div className="my-project-filters">
        <select value={filters.year} onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}>
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
        <select value={filters.month} onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}>
          {[...Array(12).keys()].map((month) => (
            <option key={month + 1} value={month + 1}>
              {month + 1}월
            </option>
          ))}
        </select>
      </div>
      </div>
      <div className="myproject-task-table-header">
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
      <div className="myproject-task-sections">
        {['할일', '지연', '진행중', '완료'].map((status) => (
          <div className="myproject-task-section" key={status}>
            <h3>▼ {status}</h3>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div className={`myproject-task-row ${task.status}`} key={task.id}>
                 <div
                  onClick={(e) => {
                    console.log('Date clicked for task:', task.id);
                    handleDateClick(task.id, e);
                  }}
                >
                  {task.date}
                </div>
                  <div>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskField(task.id, 'status', e.target.value)
                      }
                      className={`myproject-status-select ${task.status}`}
                    >
                      <option value="할일">할일</option>
                      <option value="지연">지연</option>
                      <option value="진행중">진행중</option>
                      <option value="완료">완료</option>
                    </select>
                  </div>
                  <div>
                  <Select
                    options={projects}
                    value={projects.find((project) => project.value === task.projectName)}
                    onChange={(selectedOption) =>
                      updateTaskField(task.id, 'projectName', selectedOption.value)
                    }
                    placeholder="사업명"
                    classNamePrefix="myproject-custom-select" // 접두사 지정
                  />
                  </div>
                  <div>
                    <select
                      value={task.categoriesName}
                      onChange={(e) =>
                        updateTaskField(task.id, 'categoriesName', e.target.value)
                      }
                      className="myproject-category-select"
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
                      className="myproject-category-select 중분류"
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
                      className="myproject-category-select 소분류"
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
                      className="myproject-delete-icon-button"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      {isCalendarOpen && (
        <div
          className="calendar-container"
          style={{
            position: 'absolute',
            top: calendarPosition.top,
            left: calendarPosition.left,
            zIndex: 800,
          }}
        >
          <Calendar onChange={handleDateChange} />
        </div>
      )}
    </div>
  );
}

export default MyProject;
