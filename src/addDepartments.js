import React from 'react';
import { db } from './firebase'; // Firebase 설정 파일 경로
import './AddDepartment.css'; // CSS 파일 추가

function AddDepartment() {
    const departmentData = {
        name: '사업부서',
        categories: [
          {
            id: 'category1',
            name: '행사운영',
            subcategories: [
              {
                id: 'subcategory1',
                name: '행사준비',
                subsubcategories: [
                  { id: 'subsubcategory1', name: '행사 개최 계획 수립', baseTime: 2 },
                  { id: 'subsubcategory2', name: '강연자 섭외', baseTime: 3 },
                  { id: 'subsubcategory3', name: '커리큘럼 및 강의교안 작성', baseTime: 0 },
                  { id: 'subsubcategory4', name: '장소 섭외', baseTime: 2 },
                  { id: 'subsubcategory5', name: '행사 운영 계획 보고서 작성(견적서 작업 포함)', baseTime: 3 },
                  { id: 'subsubcategory6', name: '참가인원 모집 및 홍보 메일링 등', baseTime: 2 },
                  { id: 'subsubcategory7', name: '신청인원 재확인 및 행사 안내(공문 등)', baseTime: 2 },
                  { id: 'subsubcategory8', name: '행사 자료 작성 및 검토', baseTime: 6 },
                  { id: 'subsubcategory9', name: '행사자료 인쇄물(현수막, x배너, 책자, 명찰등) 확인', baseTime: 2 },
                  { id: 'subsubcategory10', name: '행사장 세팅', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory2',
                name: '행사수행',
                subsubcategories: [
                  { id: 'subsubcategory11', name: '행사 운영, 관리감독, 참석자 민원응대, 정리 등', baseTime: 4 },
                ],
              },
              {
                id: 'subcategory3',
                name: '행사_후속작업_결과보고',
                subsubcategories: [
                  { id: 'subsubcategory12', name: '수료현황 분석 및 수료증 발급(필요시)', baseTime: 3 },
                  { id: 'subsubcategory13', name: '행사운영 결과보고(증빙 취합 시간 제외)', baseTime: 4 },
                ],
              },
            ],
          },
          {
            id: 'category2',
            name: '설문조사',
            subcategories: [
              {
                id: 'subcategory4',
                name: '설문조사준비',
                subsubcategories: [
                  { id: 'subsubcategory14', name: '설문조사(교육만족도 조사) 문항 작성', baseTime: 4 },
                  { id: 'subsubcategory15', name: '기술 관련 설문조사 문항 작성', baseTime: 8 },
                  { id: 'subsubcategory16', name: '설문조사 계획보고서 작성', baseTime: 2 },
                  { id: 'subsubcategory17', name: '답례품 선정 및 구입', baseTime: 2 },
                  { id: 'subsubcategory18', name: '설문조사 구글폼 작성', baseTime: 2 },
                ],
              },
              {
                id: 'subcategory5',
                name: '설문조사_배포_수행',
                subsubcategories: [
                  { id: 'subsubcategory19', name: '설문조사 배포 및 참가 독려', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory6',
                name: '설문조사_후속작업_결과보고',
                subsubcategories: [
                  { id: 'subsubcategory20', name: '설문조사 결과분석 및 결과보고서 작성', baseTime: 10 },
                ],
              },
            ],
          },
          {
            id: 'category3',
            name: '회의운영',
            subcategories: [
              {
                id: 'subcategory7',
                name: '자문_평가_회의',
                subsubcategories: [
                  { id: 'subsubcategory21', name: '자문회의 계획 수립(주제, 인원 등 사전계획)', baseTime: 2 },
                  { id: 'subsubcategory22', name: '자문위원 섭외 및 구성', baseTime: 3 },
                  { id: 'subsubcategory23', name: '장소섭외(필요시)', baseTime: 2 },
                  { id: 'subsubcategory24', name: '자문위원회 계획보고서 작성(견적서 작업 포함)/공문 발송', baseTime: 3 },
                  { id: 'subsubcategory25', name: '자문회의 회의자료 작성(HWP)', baseTime: 2 },
                  { id: 'subsubcategory26', name: '자문회의 회의자료 작성(PPT)', baseTime: 5 },
                  { id: 'subsubcategory27', name: '자문회의 준비(장소준비, 자료인쇄, 명패) 및 정리', baseTime: 3 },
                  { id: 'subsubcategory28', name: '분기별 자문위원회 개최', baseTime: 2 },
                  { id: 'subsubcategory29', name: '자문위원회 결과보고(증빙 취합 시간 제외)', baseTime: 5 },
                ],
              },
              {
                id: 'subcategory8',
                name: '내부회의',
                subsubcategories: [
                  { id: 'subsubcategory30', name: '회의 준비(회의실 예약, 계획수립, 회의자료 작성 등)', baseTime: 2 },
                  { id: 'subsubcategory31', name: '회의자료 작성(HWP)', baseTime: 1 },
                  { id: 'subsubcategory32', name: '회의자료 작성(PPT)', baseTime: 3 },
                  { id: 'subsubcategory33', name: '회의 진행(사업, 협회, 기타)', baseTime: 2 },
                  { id: 'subsubcategory34', name: '회의록 작성', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory9',
                name: '외부회의',
                subsubcategories: [
                  { id: 'subsubcategory35', name: '회의 준비(회의실 예약, 계획수립, 회의자료 출장 결의작성 등)', baseTime: 2 },
                  { id: 'subsubcategory36', name: '회의자료 작성(HWP)', baseTime: 1 },
                  { id: 'subsubcategory37', name: '회의자료 작성(PPT)', baseTime: 3 },
                  { id: 'subsubcategory38', name: '회의 진행(출장시 출장 이동 시간 포함)', baseTime: 2 },
                  { id: 'subsubcategory39', name: '회의록 작성', baseTime: 1 },
                ],
              },
            ],
          },
          {
            id: 'category4',
            name: '컨설팅 교육 조사 분석',
            subcategories: [
              {
                id: 'subcategory10',
                name: '컨설팅 교육 조사 분석 준비',
                subsubcategories: [
                  { id: 'subsubcategory40', name: '수혜기업 모집공고문 작성- 1년차/(2년차 이상)', baseTime: 4 },
                  { id: 'subsubcategory41', name: '모집공고 계획보고서 작성', baseTime: 3 },
                  { id: 'subsubcategory42', name: '신청기업 신청서류 검토 및 사전검토 자료 작성/취합', baseTime: 2 },
                  { id: 'subsubcategory43', name: '기술지도 전문가 섭외 /일정조율', baseTime: 2 },
                  { id: 'subsubcategory44', name: '월별 계획보고서 작성(GMP사업)', baseTime: 4},
                  { id: 'subsubcategory45', name: '전문가 방문 업체 안내 및 보고서 제출 및 보완 요청 (필요시 공문발송)', baseTime: 1 },
                  { id: 'subsubcategory46', name: '기술지도 상담일지/수당지급신청서 내용 확인 및 검토 / 통장, 이력서 확인', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory11',
                name: '컨설팅 교육 조사 분석 수행',
                subsubcategories: [
                  { id: 'subsubcategory47', name: '기술지도, 교육 수행', baseTime: 2 },
                  { id: 'subsubcategory48', name: '사업관련 조사분석 자료분석 준비', baseTime: 4 },
                ],
              },
              {
                id: 'subcategory12',
                name: '후속작업 결과보고',
                subsubcategories: [
                  { id: 'subsubcategory49', name: '결과보고서 작성', baseTime: 3 },
                ],
              },
            ],
          },
          {
            id: 'category5',
            name: '행정',
            subcategories: [
              {
                id: 'subcategory13',
                name: '경비_지출',
                subsubcategories: [
                  { id: 'subsubcategory50', name: '결제 건 관련 증빙서류 확인 및 취합 - 증빙 취합이 복잡할 경우', baseTime: 1 },
                  { id: 'subsubcategory51', name: '결제 건 관련 증빙서류 확인 및 취합 - 단순지출 증빙일 경우', baseTime: 0 },
                  { id: 'subsubcategory52', name: '지출결의', baseTime: 0 },
                  { id: 'subsubcategory53', name: '집행등록(이지바로/RCMS/이나라도움/NIPA 시스템 등)', baseTime: 0 },
                  { id: 'subsubcategory54', name: '예산 변경(더존, 연구관리시스템)', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory14',
                name: '문서기안',
                subsubcategories: [
                  { id: 'subsubcategory55', name: '자산구매, 명함신청, 경조지급 등', baseTime: 1 },
                  { id: 'subsubcategory56', name: '시행문, 공문', baseTime: 1 },
                  { id: 'subsubcategory57', name: '기타', baseTime: 0 },
                  { id: 'subsubcategory58', name: '출장신청서', baseTime: 0 },
                  { id: 'subsubcategory59', name: '출장보고서', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory15',
                name: '근태',
                subsubcategories: [
                  { id: 'subsubcategory60', name: '휴가, 휴직, 근무시간 변경 기타 등', baseTime: 0 },
                ],
              },
              {
                id: 'subcategory16',
                name: '회의록_업무추진비',
                subsubcategories: [
                  { id: 'subsubcategory61', name: '사전품의', baseTime: 0 },
                  { id: 'subsubcategory62', name: '회의록 작성', baseTime: 1 },
                ],
              },
            ],
          },
          {
            id: 'category6',
            name: '기획관리',
            subcategories: [
              {
                id: 'subcategory17',
                name: '사업기획_계획서준비',
                subsubcategories: [
                  { id: 'subsubcategory63', name: '사업계획서 초안 작성 및 취합(주관)', baseTime: 75 },
                  { id: 'subsubcategory64', name: '사업계획서 초안 작성(참여)', time: 30 },
                  { id: 'subsubcategory65', name: '사업계획 대비 예산내역 초안 산출/ 산출근거 자료 취합(주관)', baseTime: 16 },
                  { id: 'subsubcategory66', name: '사업계획 대비 예산내역 초안 산출/ 산출근거 자료 취합(참여)', baseTime: 12 },
                  { id: 'subsubcategory67', name: '협약 제반 서류 준비 및 취합(주관)', baseTime: 8 },
                  { id: 'subsubcategory68', name: '협약 제반 서류 준비(참여)', baseTime: 5 },
                  { id: 'subsubcategory69', name: '사업계획 PPT 작성 및 취합(주관)', baseTime: 20 },
                  { id: 'subsubcategory70', name: '사업계획 PPT 작성(참여)', baseTime: 8 },
                ],
              },
              {
                id: 'subcategory18',
                name: '협약변경_수정사업계획서',
                subsubcategories: [
                  { id: 'subsubcategory71', name: '사업계획변경서류 작성 및 계획서 수정', baseTime: 5 },
                  { id: 'subsubcategory72', name: '보완서류준비 검토', baseTime: 1 },
                  { id: 'subsubcategory73', name: '전문기관과 사전 논의', baseTime: 2 },
                  { id: 'subsubcategory74', name: '공문 작성 및 발송', baseTime: 1 },
                  { id: 'subsubcategory75', name: '협약변경사항 시스템 등록', baseTime: 2 },
                ],
              },
              {
                id: 'subcategory19',
                name: '실사_중간점검',
                subsubcategories: [
                  { id: 'subsubcategory76', name: '중간점검 발표자료 작성', baseTime: 10 },
                  { id: 'subsubcategory77', name: '중간점검 성과물/집행 자료 정리 및 라벨링(인쇄포함)', baseTime: 60 },
                  { id: 'subsubcategory78', name: '예산 집행 현황 및 계획 작성', baseTime: 8 },
                  { id: 'subsubcategory79', name: '회계법인 자료 준비, 중간점검 의견 준비 보완', baseTime: 5 },
                ],
              },
              {
                id: 'subcategory20',
                name: '최종_연차보고',
                subsubcategories: [
                  { id: 'subsubcategory80', name: '최종보고서 초안 작성(주관)', baseTime: 80 },
                  { id: 'subsubcategory81', name: '최종보고서 초안 작성(참여)', baseTime: 50 },
                  { id: 'subsubcategory82', name: '최종보고서 보완(주관)', baseTime: 25 },
                  { id: 'subsubcategory83', name: '최종보고서 보완(참여)', baseTime: 16 },
                  { id: 'subsubcategory84', name: '연차평가 발표자료 작성(주관)', baseTime: 30 },
                  { id: 'subsubcategory85', name: '연차평가 발표자료 작성(참여)', baseTime: 16 },
                ],
              },
              {
                id: 'subcategory21',
                name: '사업비정산',
                subsubcategories: [
                  { id: 'subsubcategory86', name: '집행등록 내역 확인 / 증빙서류 확인', baseTime: 32 },
                  { id: 'subsubcategory87', name: '사업비 정산 미비서류 검토 및 제출', baseTime: 16 },
                  { id: 'subsubcategory88', name: '사업비 정산 사업비 집행실적 보고서 작성', baseTime: 8 },
                  { id: 'subsubcategory89', name: '사업비 정산 이자반납', baseTime: 0 },
                ],
              },
            ],
          },
          {
            id: 'category7',
            name: '용역구매',
            subcategories: [
              {
                id: 'subcategory22',
                name: '용역준비_협상_평가',
                subsubcategories: [
                  { id: 'subsubcategory90', name: '제안요청서 / 과업지시서 / 입찰공고문 작성', baseTime: 50 },
                  { id: 'subsubcategory91', name: '계약서 작성', baseTime: 20 },
                  { id: 'subsubcategory92', name: '비교견적서/제안서 요청', baseTime: 2 },
                  { id: 'subsubcategory93', name: '용역 계획보고', baseTime: 4 },
                  { id: 'subsubcategory94', name: '공고 협조', baseTime: 0 },
                  { id: 'subsubcategory95', name: '제안서 평가위원 섭외', baseTime: 0 },
                  { id: 'subsubcategory96', name: '제안서 평가위원회 개최', baseTime: 0 },
                  { id: 'subsubcategory97', name: '기술협상 / 과업내용 협의', baseTime: 8 },
                  { id: 'subsubcategory98', name: '제안서 평가위원회 결과보고', baseTime: 0 },
                  { id: 'subsubcategory99', name: '용역 계약 체결', baseTime: 0 },
                  { id: 'subsubcategory100', name: '용역 계약 체결 결과보고', baseTime: 0 },
                ],
              },
              {
                id: 'subcategory23',
                name: '용역수행',
                subsubcategories: [
                  { id: 'subsubcategory101', name: '선금지급 절차 진행', baseTime: 4 },
                  { id: 'subsubcategory102', name: '정기적 진도점검 회의(온/오프) : 일정조율', baseTime: 1 },
                  { id: 'subsubcategory103', name: '정기적 진도점검 회의(온/오프) : 점검사항 체크', baseTime: 2 },
                  { id: 'subsubcategory104', name: '중간보고회(필요시) : 일정조율', baseTime: 1 },
                  { id: 'subsubcategory105', name: '중간보고회(필요시) : 점검사항 체크', baseTime: 2 },
                  { id: 'subsubcategory106', name: '계약상대자의 진척율 체크, 중간결과물 점검', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory24',
                name: '용역_후속작업_결과보고',
                subsubcategories: [
                  { id: 'subsubcategory107', name: '완료보고서 요청 및 검토', baseTime: 40 },
                  { id: 'subsubcategory108', name: '용역 완료보고 : 일정조율', baseTime: 1 },
                  { id: 'subsubcategory109', name: '용역 완료보고 : 산출물 최종 검토', baseTime: 40 },
                  { id: 'subsubcategory110', name: '잔금지급 절차 진행', baseTime: 5 },
                ],
              },
            ],
          },
          {
            id: 'category8',
            name: '홍보',
            subcategories: [
              {
                id: 'subcategory25',
                name: '홍보물제작',
                subsubcategories: [
                  { id: 'subsubcategory111', name: '뉴스레터 작성', baseTime: 4 },
                  { id: 'subsubcategory112', name: '뉴스레터 디자인 요청 및 작업', baseTime: 0 },
                  { id: 'subsubcategory113', name: '뉴스레터 최종본 검토', baseTime: 1 },
                  { id: 'subsubcategory114', name: '홍보물 초안 작성', baseTime: 2 },
                  { id: 'subsubcategory115', name: '홍보물 포스터 디자인', baseTime: 0 },
                  { id: 'subsubcategory116', name: '홍보물 제작 검토(내용, 디자인, 견적, 납품일 등)', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory26',
                name: '홍보수행',
                subsubcategories: [
                  { id: 'subsubcategory117', name: '뉴스레터 발송', baseTime: 1 },
                  { id: 'subsubcategory118', name: '홍보물 발송 및 배포 협조 요청', baseTime: 1 },
                ],
              },
            ],
          },
          {
            id: 'category9',
            name: '사업부서_검토_수정',
            subcategories: [
              {
                id: 'subcategory27',
                name: '간단_검토수정',
                subsubcategories: [
                  { id: 'subsubcategory119', name: '간단_검토수정', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory28',
                name: '상세_검토수정',
                subsubcategories: [
                  { id: 'subsubcategory120', name: '상세_검토수정', baseTime: 3 },
                ],
              },
            ],
          },
          {
            id: 'category10',
            name: '사업부서_기타',
            subcategories: [
              {
                id: 'subcategory29',
                name: '타부서지원',
                subsubcategories: [
                  { id: 'subsubcategory121', name: '타부서지원', baseTime: 1 },
                ],
              },
              {
                id: 'subcategory30',
                name: '협회기타',
                subsubcategories: [
                  { id: 'subsubcategory122', name: '협회 기타(자리이동, 청소, 주간회의 등)', baseTime: 1 },
                ],
              },
            ],
          },
          {
            id: 'category11',
            name: '전시회',
            subcategories: [
              {
                id: 'subcategory31',
                name: '전시회준비',
                subsubcategories: [
                  { id: 'subsubcategory123', name: '참가계획 수립', baseTime: 5 },
                  { id: 'subsubcategory124', name: '전시회 계획보고서 작성(견적서 작업 포함)', baseTime: 3 },
                  { id: 'subsubcategory125', name: '부스 및 설치 가구류 계약', baseTime: 2 },
                  { id: 'subsubcategory126', name: '족자봉 작성', baseTime: 5 },
                  { id: 'subsubcategory127', name: '교통 및 숙박 인원 확정', baseTime: 2 },
                  { id: 'subsubcategory128', name: '전시회 참가 물품 확인(족자봉, 브로슈어, 홍보물, 신문 등)', baseTime: 1 },
                  { id: 'subsubcategory129', name: '전시회 부스 설치', baseTime: 4 },
                ],
              },
              {
                id: 'subcategory32',
                name: '전시회운영',
                subsubcategories: [
                  { id: 'subsubcategory130', name: '전시회 참가', baseTime: 24 },
                ],
              },
              {
                id: 'subcategory33',
                name: '전시회_후속작업_결과보고',
                subsubcategories: [
                  { id: 'subsubcategory131', name: '전시회 결과보고서 작성', baseTime: 4 },
                ],
              },
            ],
          }
          
        ],
      };
      

  const addDepartmentData = () => {
    db.collection('departments')
      .doc('business')
      .set(departmentData)
      .then(() => console.log('Department data added successfully!'))
      .catch((error) => console.error('Error adding department data:', error));
  };

  return (
    <div className="add-department-container">
      <button className="add-department-button" onClick={addDepartmentData}>
        Add Department
      </button>
    </div>
  );
}

export default AddDepartment;
