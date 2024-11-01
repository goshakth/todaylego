import React, { useState, useEffect } from 'react';
import './myproject.css';

function MyProject() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // 초기 작업 로딩 (예제 데이터를 로드하거나 API를 사용할 수 있음)
    loadTasks();
  }, []);

  const loadTasks = () => {
    // 예제 데이터 생성
    const newTasks = [
      { id: 1, date: '24.10.28', status: '할일', projectName: '기타', category1: '검토 수정', category2: '검토 수정', category3: '검토 수정', baseTime: 4, spentTime: 0, remainingTime: 4, note: '' },
      { id: 2, date: '24-10-25', status: '지연', projectName: '비대면', category1: '기획관리', category2: '사업계획서', category3: '초안작성', baseTime: 30, spentTime: 32, remainingTime: -2, note: '지연사유: 계획서 변경' },
      { id: 3, date: '24-10-29', status: '진행중', projectName: '새싹 생성 3기', category1: '교육 운영', category2: '홍보', category3: '온라인 홍보', baseTime: 20, spentTime: 15, remainingTime: 5, note: '' },
      { id: 4, date: '24-10-28', status: '완료', projectName: 'K-Health', category1: '검토 수정', category2: '검토 수정', category3: '검토 수정', baseTime: 4, spentTime: 4, remainingTime: 0, note: '검토의견 관련 수정' },
      { id: 5, date: '24-10-28', status: '완료', projectName: '비대면', category1: '검토 수정', category2: '검토 수정', category3: '검토 수정', baseTime: 4, spentTime: 4, remainingTime: 0, note: '중간보고서 검토' },
      { id: 6, date: '24-10-28', status: '완료', projectName: '비대면', category1: '검토 수정', category2: '검토 수정', category3: '검토 수정', baseTime: 4, spentTime: 3, remainingTime: 0, note: '중간보고서 검토' },
      { id: 7, date: '24-10-28', status: '완료', projectName: 'CRO', category1: '검토 수정', category2: '검토 수정', category3: '검토 수정', baseTime: 4, spentTime: 2, remainingTime: 0, note: '백업 수정' },
      { id: 8, date: '24-10-28', status: '완료', projectName: 'CRO', category1: '검토 수정', category2: '검토 수정', category3: '검토 수정', baseTime: 4, spentTime: 4, remainingTime: 0, note: '백업 검토' },

      
      // 추가 예제 데이터
    ];
    setTasks(newTasks);
  };

  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      date: '24.10.25',
      status: '할일',
      projectName: '기타',
      category1: '검토 수정',
      category2: '검토 수정',
      category3: '검토 수정',
      baseTime: 4,
      spentTime: 0,
      remainingTime: 4,
      note: ''
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const updateTaskField = (taskId, field, value) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        let updatedTask = { ...task, [field]: value };

        // 소요 시간과 잔여 시간 계산
        if (field === 'spentTime') {
          updatedTask.spentTime = parseInt(value) || 0;
          updatedTask.remainingTime = updatedTask.baseTime - updatedTask.spentTime;

          // 잔여 시간이 음수이면 "지연 됨"으로 상태 변경
          if (updatedTask.remainingTime < 0) {
            updatedTask.status = '지연';
          } else {
            updatedTask.status = '할일';
          }
        }

        return updatedTask;
      }
      return task;
    }));
  };

  const renderTasksByStatus = (status) => {
    const filteredTasks = tasks.filter(task => task.status === status);
    return (
      <div className="task-section">
        <h3> ▼   {status}</h3>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div className="task-row" key={task.id}>
              <div>{task.date}</div>
              <div>
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className={`status-select ${task.status.replace(' ', '')}`} // 상태에 따른 클래스명 추가
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
                  className={`project-select ${task.projectName.replace(' ', '')}`} // 상태에 따른 클래스명 추가
                >
                    
                  <option value="기타">기타</option>
                  <option value="비대면">비대면</option>
                  <option value="CRO">CRO</option>
                  <option value="K-Health">K-Health</option>
                </select>
              </div>
              <div>
                <select
                  value={task.category1}
                  onChange={(e) => updateTaskField(task.id, 'category1', e.target.value)}
                  className="category-select"
                >
                  <option value="검토 수정">검토 수정</option>
                  <option value="기획관리">기획관리</option>
                  <option value="교육 운영">교육 운영</option>
                </select>
              </div>
              <div>
                <select
                  value={task.category2}
                  onChange={(e) => updateTaskField(task.id, 'category2', e.target.value)}
                  className="category-select"
                >
                  <option value="검토 수정">검토 수정</option>
                  <option value="사업계획서">사업계획서</option>
                  <option value="홍보">홍보</option>
                </select>
              </div>
              <div>
                <select
                  value={task.category3}
                  onChange={(e) => updateTaskField(task.id, 'category3', e.target.value)}
                  className="category-select"
                >
                  <option value="검토 수정">검토 수정</option>
                  <option value="초안작성">초안작성</option>
                  <option value="온라인 홍보">온라인 홍보</option>
                </select>
              </div>
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
              </div>
            </div>
          ))
        ) : (
          <div className="no-tasks">작업이 없습니다.</div>
        )}
      </div>
    );
  };

  return (
    <div className="my-project">
      <div className="project-header">
        <button onClick={addTask}>+ 작업 추가</button>
      </div>
      
      {/* 기준이 되는 테이블 헤더 */}
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
        {renderTasksByStatus('할일')}
        {renderTasksByStatus('지연')}
        {renderTasksByStatus('진행중')}
        {renderTasksByStatus('완료')}
      </div>
    </div>
  );
}

export default MyProject;
