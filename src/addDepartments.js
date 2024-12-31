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
                  { id: 'subsubcategory51', name: '결제 건 관련 증빙서류 확인 및 취합 - 단순지출 증빙일 경우', baseTime: 0.1 },
                  { id: 'subsubcategory52', name: '지출결의', baseTime: 0.2 },
                  { id: 'subsubcategory53', name: '집행등록(이지바로/RCMS/이나라도움/NIPA 시스템 등)', baseTime: 0.5 },
                  { id: 'subsubcategory54', name: '예산 변경(더존, 연구관리시스템)', baseTime: 0.5 },
                ],
              },
              {
                id: 'subcategory14',
                name: '문서기안',
                subsubcategories: [
                  { id: 'subsubcategory55', name: '자산구매, 명함신청, 경조지급 등', baseTime: 0.5 },
                  { id: 'subsubcategory56', name: '시행문, 공문', baseTime: 1 },
                  { id: 'subsubcategory57', name: '기타', baseTime: 0.2 },
                  { id: 'subsubcategory58', name: '출장신청서', baseTime: 0.2 },
                  { id: 'subsubcategory59', name: '출장보고서', baseTime: 0.5 },
                ],
              },
              {
                id: 'subcategory15',
                name: '근태',
                subsubcategories: [
                  { id: 'subsubcategory60', name: '휴가, 휴직, 근무시간 변경 기타 등', baseTime: 0.2 },
                ],
              },
              {
                id: 'subcategory16',
                name: '회의록_업무추진비',
                subsubcategories: [
                  { id: 'subsubcategory61', name: '사전품의', baseTime: 0.2 },
                  { id: 'subsubcategory62', name: '회의록 작성', baseTime: 0.6 },
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
                  { id: 'subsubcategory71', name: '사업획변경서류 작성 및 계획서 수정', baseTime: 5 },
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
                  { id: 'subsubcategory89', name: '사업비 정산 이자반납', baseTime: 0.1 },
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
                  { id: 'subsubcategory94', name: '공고 협조', baseTime: 0.5 },
                  { id: 'subsubcategory95', name: '제안서 평가위원 섭외', baseTime: 1 },
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
                  { id: 'subsubcategory112', name: '뉴스레터 디자인 요청 및 작업', baseTime: 0.5 },
                  { id: 'subsubcategory113', name: '뉴스레터 최종본 검토', baseTime: 1 },
                  { id: 'subsubcategory114', name: '홍보물 초안 작성', baseTime: 2 },
                  { id: 'subsubcategory115', name: '홍보물 포스터 디자인', baseTime: 0.5 },
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
    const departmentData2 = {
        name: '경영부서',
        categories: [
            {
                id: 'category1',
                name: '사업관리',
                subcategories: [
                    {
                        id: 'subcategory1',
                        name: '은행업무',
                        subsubcategories: [
                            { id: 'subsubcategory1', name: '사업비 계좌 개설 / 카드 발급 비정기', baseTime: 2 },
                            { id: 'subsubcategory2', name: '카드 영수증 여부 확인(15/23일), 정기', baseTime: 0.5 },
                            { id: 'subsubcategory3', name: '통장 유효카드 정리, 비정기', baseTime: 2 }
                        ]
                    },
                    {
                        id: 'subcategory2',
                        name: '아마란스',
                        subsubcategories: [
                            { id: 'subsubcategory4', name: '아마란스 등록 및 검토부여(교통비용, 신규카드, 급용거래처), 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory5', name: '아마란스 교육 등록 완료', baseTime: 0.5 },
                            { id: 'subsubcategory6', name: '예산 편성 및 조정 / 승인 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory7', name: '사업별 전표 확인 및 발행, 정기', baseTime: 0.5 },
                            { id: 'subsubcategory8', name: '사업별 계정분류 확인 정기', baseTime: 0.5 },
                            { id: 'subsubcategory9', name: '아마란스 교육결재시스템 사용 오류 및 문의사항 대응(건당) 요청', baseTime: 0.5 },
                            { id: 'subsubcategory10', name: '전사공지(매입, 매출, 게시판) 비정기', baseTime: 0.2 },
                            { id: 'subsubcategory11', name: '전자결재 양식 검색 및 등록/수정 비정기', baseTime: 1 },
                            { id: 'subsubcategory12', name: '예산초기이월 및 마감 등록, 정기', baseTime: 1.5 }
                        ]
                    },
                    {
                        id: 'subcategory3',
                        name: '전자결재',
                        subsubcategories: [
                            { id: 'subsubcategory13', name: '사업 관련 문서 검토(아마란스 전자결재 문서), 정기', baseTime: 5 },
                            { id: 'subsubcategory14', name: '사업 관련 문서 협조 결재, 정기', baseTime: 0.7 },
                            { id: 'subsubcategory161', name: '사업 관련 문서 보완사항 검토의견 등록, 정기', baseTime: 0.7 }
                        ]
                    },
                    {
                        id: 'subcategory4',
                        name: '경영_사업관리',
                        subsubcategories: [
                            { id: 'subsubcategory15', name: '사업계획서/협약서/계약서 취합 및 검토, 비정기', baseTime: 2 },
                            { id: 'subsubcategory16', name: '월별 지출결의 및 집행등록 안내(카드, 임차료 등), 정기', baseTime: 0.5 },
                            { id: 'subsubcategory17', name: '요청시 매출전표/세금계산서 확인 및 송부(공유), 요청', baseTime: 0.1 },
                            { id: 'subsubcategory18', name: '사업비 전체 상시점검 의견 확인 및 검토 /수정사항 전달 비정기', baseTime: 3 },
                            { id: 'subsubcategory19', name: '사업비 이체 및 이체확인증 첨부, 정기', baseTime: 3 },
                            { id: 'subsubcategory20', name: '용역사업 이체 내역 정리(기타소득 등 구분), 정기', baseTime: 1 },
                            { id: 'subsubcategory21', name: '사업 예산소진을 확인 및 검토, 비기', baseTime: 1 },
                            { id: 'subsubcategory22', name: '이자 반납 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory23', name: '사업 실무 관련 문의사항 대응/ 담당자A 작성, 요청', baseTime: 0.5 },
                            { id: 'subsubcategory24', name: '협약관련 서류 준비, 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory25', name: '사업시스템 인건비 변경, 비정기', baseTime: 3 },
                            { id: 'subsubcategory26', name: '사업별 인건비 등록 (25개 사업), 정기', baseTime: 12 },
                            { id: 'subsubcategory27', name: '사업별 인건비 지출결의 ,정기', baseTime: 4 },
                            { id: 'subsubcategory28', name: '사업별 인건비 증빙 사업시스템 등록, 정기', baseTime: 3 },
                            { id: 'subsubcategory29', name: '교육관련 수입지출 확인, 정기', baseTime: 1 },
                            { id: 'subsubcategory30', name: '교육결재시스템 관리, 정기', baseTime: 0.5 }
                        ]
                    }
                ]
            },
            {
                id: 'category2',
                name: '구매계약관리',
                subcategories: [
                    {
                        id: 'subcategory5',
                        name: '계약관리',
                        subsubcategories: [
                            { id: 'subsubcategory31', name: '공고문 및 제안요청서 검토(계약업체, 관련 법규 검토), 비정기', baseTime: 2 },
                            { id: 'subsubcategory32', name: '나라장터 실무 문의, 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory33', name: '사전공고 및 입찰 공고 게재, 비정기', baseTime: 1 },
                            { id: 'subsubcategory34', name: '입찰업체 문의 대응, 비정기', baseTime: 1 },
                            { id: 'subsubcategory35', name: '제안서 정량평가, 비정기', baseTime: 2 },
                            { id: 'subsubcategory36', name: '제안서 평가위원회 준비, 비정기', baseTime: 3 },
                            { id: 'subsubcategory37', name: '제안서 평가위원회 개최, 비정기', baseTime: 1 },
                            { id: 'subsubcategory38', name: '제안서 평가위원회 결과보고, 비정기', baseTime: 2 },
                            { id: 'subsubcategory39', name: '계약서 작성, 비정기', baseTime: 2 },
                            { id: 'subsubcategory40', name: '계약 응답서 및 서류 검토, 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory41', name: '계약 체결, 비정기', baseTime: 1.5 },
                            { id: 'subsubcategory42', name: '수의계약서 서류 구비 요청 및 검토, 비정기', baseTime: 1 }
                        ]
                    },
                    {
                        id: 'subcategory6',
                        name: '자산관리',
                        subsubcategories: [
                            { id: 'subsubcategory43', name: '사업별 자산구매 계획 취합, 비정기', baseTime: 15 },
                            { id: 'subsubcategory44', name: '자산구매요청서 검토 및 필요여부 확인, 비정기', baseTime: 1 },
                            { id: 'subsubcategory45', name: '구입품의서 작성 및 견적서 수취, 비정기', baseTime: 1 },
                            { id: 'subsubcategory46', name: '자산 구매 비정기', baseTime: 0.2 },  
                            { id: 'subsubcategory47', name: '검수 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory48', name: '자산전수조사 계획 수립, 정기', baseTime: 2.5 },
                            { id: 'subsubcategory49', name: '자산전수조사, 정기', baseTime: 16 },
                            { id: 'subsubcategory50', name: '자산구매 실제 집행여부 검토, 비정기', baseTime: 2.5 },
                            { id: 'subsubcategory51', name: '인사 변동시 자산 현행화, 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory162', name: '사무용품 구입 예산 확인 및 견적서 수취, 비정기', baseTime: 1 }
                        ]
                    }
                ]
            },
            {
                id: 'category3',
                name: '협회운영관리',
                subcategories: [
                    {
                        id: 'subcategory7',
                        name: '협회홍보',
                        subsubcategories: [
                            { id: 'subsubcategory52', name: '홈페이지 수정 및 관리(요청건별), 요청', baseTime: 0.5 },
                            { id: 'subsubcategory53', name: '뉴스레터 작성(뉴스레터 내용 선별), 정기', baseTime: 5 },
                            { id: 'subsubcategory54', name: '뉴스레터 배포, 정기', baseTime: 0.2 }
                        ]
                    },
                    {
                        id: 'subcategory8',
                        name: '법인등기부등본변경',
                        subsubcategories: [
                            { id: 'subsubcategory55', name: '(정관, 임원등기 관련) 정관변경내용 확인, 비정기', baseTime: 0.2 },
                            { id: 'subsubcategory56', name: '(정���, 임원등기 관련) 각부처 정관변경 내용확인요청 후 허가여부 확인 및 대응, 비정기', baseTime: 1 },
                            { id: 'subsubcategory57', name: '(정관, 임원등기 관련) 기안작성, 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory58', name: '(정관, 임원등기 관련) 등기내용 변경 (협회, 더케이플러스 등), 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory59', name: '(정관, 임원등기 관련) 총회 이사회 관련 내용 안내 및 연락 (위임장, 서면 결의서 안내, 비정기', baseTime: 6 },
                            { id: 'subsubcategory60', name: '(정관, 임원등기 관련) 위임장 및 인감증명서 취합, 비정기', baseTime: 2 },
                            { id: 'subsubcategory61', name: '법인등기부등본 변경(정관, 임원등기 관련) 등기변경 관련 서류 작성 및 발송, 비정기', baseTime: 1.5 },
                            { id: 'subsubcategory62', name: '(정관, 임원등기 관련) 각 부처 결과보고, 비정기', baseTime: 0.5 }
                        ]
                    },
                    {
                        id: 'subcategory9',
                        name: '규정',
                        subsubcategories: [
                            { id: 'subsubcategory63', name: '이사회운영규정, 운영위원회 규정, 회원관리규정 등 관련 타기관 규정 검토, 비정기', baseTime: 3 },
                            { id: 'subsubcategory64', name: '규정개정 내용 신구대비표 작성, 비정기', baseTime: 1 }
                        ]
                    },
                    {
                        id: 'subcategory10',
                        name: '총회_이사회운영',
                        subsubcategories: [
                            { id: 'subsubcategory65', name: '총회, 이사회 기획 및 계획 수립, 정기', baseTime: 2 },
                            { id: 'subsubcategory66', name: '총회, 이사회 주요안건 선정, 정기', baseTime: 3 },
                            { id: 'subsubcategory67', name: '총회 장소 섭외, 정기', baseTime: 3 },
                            { id: 'subsubcategory68', name: '축사 및 개회사 작성 (주요내빈), 정기', baseTime: 3 },
                            { id: 'subsubcategory69', name: '총회, 이사회 기안 작성, 정기', baseTime: 0.2 },
                            { id: 'subsubcategory70', name: '주요내빈 메일주소 취합, 정기', baseTime: 0.5 },
                            { id: 'subsubcategory71', name: '회원사 및 주요내빈 공문발송, 정기', baseTime: 0.5 },
                            { id: 'subsubcategory72', name: '총회, 이사회 개최 연락 (위임장, 서면결의서 안내), 정기', baseTime: 6 },
                            { id: 'subsubcategory73', name: '주요내빈 (축하영상,축사 회신날짜 연락 및 정리), 정기', baseTime: 0.5 },
                            { id: 'subsubcategory74', name: '초청장 및 현수막 외 제작 요청, 정기', baseTime: 2 },
                            { id: 'subsubcategory75', name: '전년도 사업실적 취합 및 작성, 정기', baseTime: 3 },
                            { id: 'subsubcategory76', name: '당해년도 사업계획 취합 및 작성, 정기', baseTime: 3 },
                            { id: 'subsubcategory77', name: '감사보고 및 감사보고서 취합 및 정리, 정기', baseTime: 1 },
                            { id: 'subsubcategory78', name: '위임장 및 인감증명서 취합 및 확인, 정기', baseTime: 0.5 },
                            { id: 'subsubcategory79', name: '주요내빈 참석자 확인, 정기', baseTime: 1 },
                            { id: 'subsubcategory80', name: '자료집 초안 작성 / PPT 준비작성, 정기', baseTime: 6 },
                            { id: 'subsubcategory81', name: '총회이사회 진행 스크립트 작성, 정기', baseTime: 0.5 },
                            { id: 'subsubcategory82', name: '총회 참석자 문자 보내기, 정기', baseTime: 0.5 },
                            { id: 'subsubcategory83', name: '행사물품 준비(명패, 현수막, usb등), 정기', baseTime: 3 },
                            { id: 'subsubcategory84', name: '총회, 이사회 회의록(의사록) 작성, 정기', baseTime: 0.5 },
                            { id: 'subsubcategory85', name: '평가 및 결과보고, 정기', baseTime: 2 },
                            { id: 'subsubcategory86', name: '각부처별 총회, 이사회 결과보고, 정기', baseTime: 0.5 },
                            { id: 'subsubcategory87', name: '회원사 회원증 발급 및 우편발송, 정기', baseTime: 0.2 },
                            { id: 'subsubcategory88', name: '부처별 연차보고서 작성 및 발송, 정기', baseTime: 0.5 }
                        ]
                    },
                    {
                        id: 'subcategory11',
                        name: '감사계획_운영관리',
                        subsubcategories: [
                            { id: 'subsubcategory89', name: '감사 관련 내용 확인 및 문서화', baseTime: 4 },
                            { id: 'subsubcategory90', name: '감사 프로세스 정립', baseTime: 2 },
                            { id: 'subsubcategory91', name: '참고인 면담 등 감사 실시', baseTime: 8 },
                            { id: 'subsubcategory92', name: '감사 보고서 정리 및 관련 면담, 타 감사 자료 등 협력', baseTime: 4 },
                            { id: 'subsubcategory93', name: '결과보고', baseTime: 2 },
                            { id: 'subsubcategory94', name: '외부감사 대비 회의 참석', baseTime: 2 }
                        ]
                    }
                ]
            },
            {
                id: 'category4',
                name: '인사조직관리',
                subcategories: [
                    {
                        id: 'subcategory12',
                        name: '직원교육',
                        subsubcategories: [
                            { id: 'subsubcategory95', name: '교육준비 (행정교육), 비정기', baseTime: 2 },
                            { id: 'subsubcategory96', name: '일반행정업무매뉴얼 수정사항/오류사항 파악 및 수정/업로드/전사공지, 비정기', baseTime: 1 },
                            { id: 'subsubcategory97', name: '일반행정교육 관련 문제 출제 및 관리, 비정기', baseTime: 1 },
                            { id: 'subsubcategory98', name: '보완교육, 비정기', baseTime: 0.5 },
                        ]
                    },
                    {
                        id: 'subcategory13',
                        name: '인사관리',
                        subsubcategories: [
                            { id: 'subsubcategory100', name: '직원 현황 파악, 정기', baseTime: 1 },
                            { id: 'subsubcategory101', name: '직원 업무역량 강화를 위한 분석 및 방안 마련, 비정기', baseTime: 1.5 },
                            { id: 'subsubcategory102', name: '신규직원 채용 요청서 파악 후 보고 및 논의, 비정기', baseTime: 1 },
                            { id: 'subsubcategory103', name: '채용공고사이트 채용공고 업로드, 비정기', baseTime: 0.2 },
                            { id: 'subsubcategory104', name: '입사지원현황 파악 및 면접자 선정, 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory163', name: '채용면접 진행 및 확정, 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory164', name: '직원별 업무역량 보고(행정 및 문서 상), 정기', baseTime: 3 }
                        ]
                    },
                    {
                        id: 'subcategory14',
                        name: '조직관리',
                        subsubcategories: [
                            { id: 'subsubcategory105', name: '부서별 현황 파악(수행 업무, 주력사업 등), 비정기', baseTime: 2.5 },
                            { id: 'subsubcategory106', name: '부서별 인원(고충)사항 접수, 매일', baseTime: 0.5 }
                        ]
                    }
                ]
            },
            {
                id: 'category5',
                name: '경영_근태관리',
                subcategories: [
                    {
                        id: 'subcategory15',
                        name: '경영_근태관리',
                        subsubcategories: [
                            { id: 'subsubcategory107', name: '임직원 근태현황 파악, 정기', baseTime: 2 },
                            { id: 'subsubcategory108', name: '근태이상자 이상현황 안내 및 조치요청, 정기', baseTime: 1 },
                            { id: 'subsubcategory109', name: '근태조정 및 승인, 정기', baseTime: 0.5 },
                            { id: 'subsubcategory110', name: '최종근태이상자 점고 조치, 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory111', name: '사업부서 출장현황 파악, 비정기', baseTime: 0.5 }
                        ]
                    },
                    {
                        id: 'subcategory16',
                        name: '경영_연차관리',
                        subsubcategories: [
                            { id: 'subsubcategory112', name: '임직원 연차현황 파악, 비정기', baseTime: 1 },
                            { id: 'subsubcategory113', name: '연차 생성 및 확정, 정기', baseTime: 1 },
                            { id: 'subsubcategory114', name: '연차조정 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory115', name: '포상 및 대체휴가 부여 관리, 비정기', baseTime: 0.5 }
                        ]
                    }
                ]
            },
            {
                id: 'category6',
                name: '재무관리',
                subcategories: [
                    {
                        id: 'subcategory17',
                        name: '인건비관리',
                        subsubcategories: [
                            { id: 'subsubcategory116', name: '임직원 연봉현황 파악, 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory117', name: '직원별 연봉 및 과제인건비 단가 관리, 정기', baseTime: 1.5 },
                            { id: 'subsubcategory118', name: '조직개편, 신규입사 및 퇴사자 발생에 따른 인건비 조정, 비정기', baseTime: 2 },
                            { id: 'subsubcategory119', name: '정기 및 수시 연봉협상(재계약 및 연봉협상 대상자 파악), 비정기', baseTime: 0.5 },
                            { id: 'subsubcategory120', name: '각 부서별 인원대비 연봉현황 파악 및 보고(조직개편 전후, 채용요청서 접수 전후 등)', baseTime: 1 },
                            { id: 'subsubcategory121', name: '급여명세서 작성, 정리', baseTime: 1 },
                            { id: 'subsubcategory122', name: '급여명세서 지출결의서 작성 및 전표발행, 정기', baseTime: 0.2 },
                            { id: 'subsubcategory165', name: '급여이체, 정기', baseTime: 0.5 },
                        ]
                    },
                    {
                        id: 'subcategory18',
                        name: '전년도실적보고',
                        subsubcategories: [
                            { id: 'subsubcategory123', name: '전년도 계획대비 실적 현황 파악, 정기', baseTime: 5 },
                            { id: 'subsubcategory124', name: '문제점 및 개선방안 마련(을 위한 고민), 정기', baseTime: 10 },
                            { id: 'subsubcategory125', name: '개선방안 보고 및 논의, 정기', baseTime: 15 },
                            { id: 'subsubcategory126', name: '개선방안 반영, 정기', baseTime: 1 }
                        ]
                    },
                    {
                        id: 'subcategory19',
                        name: '당해년도계획수립',
                        subsubcategories: [
                            { id: 'subsubcategory127', name: '연간 사업비 지급수지계획(예상 수입 및 지출 파악), 정기', baseTime: 16 },
                            { id: 'subsubcategory128', name: '각 사업별 예산수립 지원(비세목별 기준 마련), 정기', baseTime: 8 },
                            { id: 'subsubcategory129', name: '각 사업별 예산안 검토 및 조정, 정기', baseTime: 5 },
                            { id: 'subsubcategory130', name: '연간 운영비 지급수지계획(예상 수입 및 지출 파악), 정기', baseTime: 10 },
                            { id: 'subsubcategory131', name: '용역(경영관리팀 수행) 사업 수행 계획 파악, 정기', baseTime: 2 },
                            { id: 'subsubcategory132', name: '협회 운영비 지출계획 수립(이마란스): 임차료/관리비/공과금/전문가활용비 등 일체, 정기', baseTime: 2 },
                            { id: 'subsubcategory133', name: '연간 임직원 인건비 수지계획 수립, 정기', baseTime: 3 },
                            { id: 'subsubcategory134', name: '협회 부채현황 파악 및 상환계획 수립, 정기', baseTime: 2 }
                        ]
                    },
                    {
                        id: 'subcategory20',
                        name: '예산편성지침마련',
                        subsubcategories: [
                            { id: 'subsubcategory135', name: '당해년도 기재부 및 소관부처 예산관리지침 파악, 비정기', baseTime: 3 },
                            { id: 'subsubcategory136', name: '상위규정과 협회 규정을 비교하여 연구비관리지침 개정, 비정기', baseTime: 2 },
                            { id: 'subsubcategory137', name: '협회 내 관리지침 개정안 배포, 비정기', baseTime: 0.2 }
                        ]
                    },
                    {
                        id: 'subcategory21',
                        name: '간접비운영계획',
                        subsubcategories: [
                            { id: 'subsubcategory138', name: '당해년도 간접비 수입 파악, 정기', baseTime: 1 },
                            { id: 'subsubcategory139', name: '당해년도 간접비 지출계획 수립, 정기', baseTime: 8 },
                            { id: 'subsubcategory140', name: '월별 간접비 지출 관리 및 현황보고, 정기', baseTime: 2 }
                        ]
                    },
                    {
                        id: 'subcategory22',
                        name: '기타사항',
                        subsubcategories: [
                            { id: 'subsubcategory141', name: '현 협회 임대차 현황 파악 및 관리(분기별 보증금 현황 등), 정기', baseTime: 0.5 },
                            { id: 'subsubcategory142', name: '협회 자문위원 풀 구성에 따른 지출비용 파악(법률,노무,세무,회계 등), 정기', baseTime: 0.5 }
                        ]
                    }
                ]
            },
            {
              id: 'category7',
              name: '회계세무',
              subcategories: [
                  {
                      id: 'subcategory23',
                      name: '회원사관리',
                      subsubcategories: [
                          { id: 'subsubcategory143', name: '회원사 및 연회비 납부현황 파악, 정기', baseTime: 0.5 },
                          { id: 'subsubcategory144', name: '회원사 가입 확인 안내, 비정기', baseTime: 0.2 },
                          { id: 'subsubcategory145', name: '연회비 납부 기안 작성 및 매일 발송, 정기', baseTime: 0.2 }
                      ]
                  },
                  {
                      id: 'subcategory24',
                      name: '운영비관리',
                      subsubcategories: [
                          { id: 'subsubcategory146', name: '운영비 관련 증빙 및 지출결의, 정기', baseTime: 0.5 },
                          { id: 'subsubcategory147', name: '운영비 전표 발행, 정기', baseTime: 0.5 },
                          { id: 'subsubcategory148', name: '운영비 정리 및 이체, 정기', baseTime: 0.2 }
                      ]
                  },
                  {
                      id: 'subcategory25',
                      name: '퇴직금',
                      subsubcategories: [
                          { id: 'subsubcategory149', name: '퇴직금 가입대상자 파악 및 통장개설 등 안내, 비정기', baseTime: 0.5 },
                          { id: 'subsubcategory150', name: '퇴직금 납부현황 파악, 비정기', baseTime: 0.5 },
                          { id: 'subsubcategory151', name: '퇴직금 수령여부 및 지급, 비정기', baseTime: 0.2 }
                      ]
                  },
                  {
                      id: 'subcategory26',
                      name: '보험세금납부',
                      subsubcategories: [
                          { id: 'subsubcategory152', name: '세금 신고자료 작성(4대보험, 소득세, 부가세), 정기', baseTime: 3 },
                          { id: 'subsubcategory153', name: '세금 납부, 정기', baseTime: 0.5 }
                      ]
                  },
                  {
                      id: 'subcategory27',
                      name: '결산',
                      subsubcategories: [
                          { id: 'subsubcategory154', name: '사업별 결산자료 대응', baseTime: 5 },
                          { id: 'subsubcategory155', name: '사업별 은행계좌, 카드내역, 운영비 계좌 등 전달(1월~9월)', baseTime: 1 },
                          { id: 'subsubcategory166', name: '사업별 결산자료 대응', baseTime: 120 },
                      ]
                  }
              ]
            },
            {
            id: 'category8',
            name: '경영_기타',
            subcategories: [
                {
                    id: 'subcategory28',
                    name: '기타업무',
                    subsubcategories: [
                        { id: 'subsubcategory156', name: '기타관련(더메디컬, 더케이플러스), 비정기', baseTime: 1 },
                        { id: 'subsubcategory157', name: '협회 물품 요청 확인(명함, 물품 등)및 품의 요청', baseTime: 0.5 },
                        { id: 'subsubcategory158', name: '협회 물품 발주 요청', baseTime: 0.5 },
                        { id: 'subsubcategory159', name: '협회 물품 배부 및 비치 요청', baseTime: 0.5 },
                        { id: 'subsubcategory160', name: '내부행정/자리배치도 수정 및 업데이트, 비정기', baseTime: 1 }
                    ]
                }
                ]
            }
        ]
    }; //166개 //경영팀
    const departmentData3 = {
        name: '디자인부서',
        categories: [
            {
                id: 'category1',
                name: '협회_디자인요청',
                subcategories: [
                    {
                        id: 'subcategory1',
                        name: '최초작업',
                        subsubcategories: [
                            { id: 'subsubcategory1', name: '(1차) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory2', name: '(1차) 포스터', baseTime: 4 },
                            { id: 'subsubcategory3', name: '(1차) 배너', baseTime: 2 },
                            { id: 'subsubcategory4', name: '(1차) 팝업', baseTime: 2.7 },
                            { id: 'subsubcategory5', name: '(1차) 현수막', baseTime: 4 },
                            { id: 'subsubcategory6', name: '(1차) ppt', baseTime: 40 },
                            { id: 'subsubcategory7', name: '(1차) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory8', name: '(1차) 명함 & 명찰', baseTime: 8 },
                            { id: 'subsubcategory9', name: '(1차) 행용 초대장 & 순서지', baseTime: 8 },
                            { id: 'subsubcategory10', name: '(1차) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory11', name: '(1차) 휘장', baseTime: 40 },
                            { id: 'subsubcategory12', name: '(1차) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory13', name: '(1차) 사진촬영 플레이지', baseTime: 8 },
                            { id: 'subsubcategory14', name: '(1차) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory15', name: '(1차) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory16', name: '(1차) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory17', name: '(1차) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory18', name: '(1차) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 3 },
                            { id: 'subsubcategory19', name: '(1차) 광고', baseTime: 4 },
                            { id: 'subsubcategory20', name: '(1차) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory21', name: '(1차) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory22', name: '(1차) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory23', name: '(1차) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    },
                    {
                        id: 'subcategory2',
                        name: '수정보완',
                        subsubcategories: [
                            { id: 'subsubcategory24', name: '(보완) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory25', name: '(보완) 포스터', baseTime: 4 },
                            { id: 'subsubcategory26', name: '(보완) 배너', baseTime: 2 },
                            { id: 'subsubcategory27', name: '(보완) 팝업', baseTime: 2 },
                            { id: 'subsubcategory28', name: '(보완) 현수막', baseTime: 2 },
                            { id: 'subsubcategory29', name: '(보완) ppt', baseTime: 30 },
                            { id: 'subsubcategory30', name: '(보완) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory31', name: '(보완) 명함 & 명찰', baseTime: 4 },
                            { id: 'subsubcategory32', name: '(보완) 행용 초대장 & 순서지', baseTime: 4 },
                            { id: 'subsubcategory33', name: '(보완) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory34', name: '(보완) 휘장', baseTime: 40 },
                            { id: 'subsubcategory35', name: '(보완) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory36', name: '(보완) 사진촬영 플레이지', baseTime: 4 },
                            { id: 'subsubcategory37', name: '(보완) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory38', name: '(보완) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory39', name: '(보완) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory40', name: '(보완) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory41', name: '(보완) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 2 },
                            { id: 'subsubcategory42', name: '(보완) 광고', baseTime: 4 },
                            { id: 'subsubcategory43', name: '(보완) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory44', name: '(보완) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory45', name: '(보완) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory46', name: '(보완) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    }
                ]
            },
            {
                id: 'category2',
                name: '경영관리팀_디자인요청',
                subcategories: [
                    {
                        id: 'subcategory3',
                        name: '최초작업',
                        subsubcategories: [
                            { id: 'subsubcategory47', name: '(1차) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory48', name: '(1차) 포스터', baseTime: 4 },
                            { id: 'subsubcategory49', name: '(1차) 배너', baseTime: 2 },
                            { id: 'subsubcategory50', name: '(1차) 팝업', baseTime: 2.7 },
                            { id: 'subsubcategory51', name: '(1차) 현수막', baseTime: 4 },
                            { id: 'subsubcategory52', name: '(1차) ppt', baseTime: 40 },
                            { id: 'subsubcategory53', name: '(1차) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory54', name: '(1차) 명함 & 명찰', baseTime: 8 },
                            { id: 'subsubcategory55', name: '(1차) 행용 초대장 & 순서지', baseTime: 8 },
                            { id: 'subsubcategory56', name: '(1차) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory57', name: '(1차) 휘장', baseTime: 40 },
                            { id: 'subsubcategory58', name: '(1차) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory59', name: '(1차) 사진촬영 플레이지', baseTime: 8 },
                            { id: 'subsubcategory60', name: '(1차) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory61', name: '(1차) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory62', name: '(1차) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory63', name: '(1차) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory64', name: '(1차) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 3 },
                            { id: 'subsubcategory65', name: '(1차) 광고', baseTime: 4 },
                            { id: 'subsubcategory66', name: '(1차) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory67', name: '(1차) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory68', name: '(1차) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory69', name: '(1차) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    },
                    {
                        id: 'subcategory4',
                        name: '수정보완',
                        subsubcategories: [
                            { id: 'subsubcategory70', name: '(보완) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory71', name: '(보완) 포스터', baseTime: 4 },
                            { id: 'subsubcategory72', name: '(보완) 배너', baseTime: 2 },
                            { id: 'subsubcategory73', name: '(보완) 팝업', baseTime: 2 },
                            { id: 'subsubcategory74', name: '(보완) 현수막', baseTime: 2 },
                            { id: 'subsubcategory75', name: '(보완) ppt', baseTime: 30 },
                            { id: 'subsubcategory76', name: '(보완) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory77', name: '(보완) 명함 & 명찰', baseTime: 4 },
                            { id: 'subsubcategory78', name: '(보완) 행용 초대장 & 순서지', baseTime: 4 },
                            { id: 'subsubcategory79', name: '(보완) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory80', name: '(보완) 휘장', baseTime: 40 },
                            { id: 'subsubcategory81', name: '(보완) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory82', name: '(보완) 사진촬영 플레이지', baseTime: 4 },
                            { id: 'subsubcategory83', name: '(보완) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory84', name: '(보완) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory85', name: '(보완) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory86', name: '(보완) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory87', name: '(보완) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 2 },
                            { id: 'subsubcategory88', name: '(보완) 광고', baseTime: 4 },
                            { id: 'subsubcategory89', name: '(보완) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory90', name: '(보완) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory91', name: '(보완) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory92', name: '(보완) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    }
                ]
            },
            {
                id: 'category3',
                name: '통합헬스케어기획팀_디자인요청',
                subcategories: [
                    {
                        id: 'subcategory5',
                        name: '최초작업',
                        subsubcategories: [
                            { id: 'subsubcategory93', name: '(1차) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory94', name: '(1차) 포스터', baseTime: 4 },
                            { id: 'subsubcategory95', name: '(1차) 배너', baseTime: 2 },
                            { id: 'subsubcategory96', name: '(1차) 팝업', baseTime: 2.7 },
                            { id: 'subsubcategory97', name: '(1차) 현수막', baseTime: 4 },
                            { id: 'subsubcategory98', name: '(1차) ppt', baseTime: 40 },
                            { id: 'subsubcategory99', name: '(1차) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory100', name: '(1차) 명함 & 명찰', baseTime: 8 },
                            { id: 'subsubcategory101', name: '(1차) 행용 초대장 & 순서지', baseTime: 8 },
                            { id: 'subsubcategory102', name: '(1차) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory103', name: '(1차) 휘장', baseTime: 40 },
                            { id: 'subsubcategory104', name: '(1차) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory105', name: '(1차) 사진촬영 플레이지', baseTime: 8 },
                            { id: 'subsubcategory106', name: '(1차) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory107', name: '(1차) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory108', name: '(1차) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory109', name: '(1차) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory110', name: '(1차) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 3 },
                            { id: 'subsubcategory111', name: '(1차) 광고', baseTime: 4 },
                            { id: 'subsubcategory112', name: '(1차) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory113', name: '(1차) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory114', name: '(1차) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory115', name: '(1차) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    },
                    {
                        id: 'subcategory6',
                        name: '수정보완',
                        subsubcategories: [
                            { id: 'subsubcategory116', name: '(보완) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory117', name: '(보완) 포스터', baseTime: 4 },
                            { id: 'subsubcategory118', name: '(보완) 배너', baseTime: 2 },
                            { id: 'subsubcategory119', name: '(보완) 팝업', baseTime: 2 },
                            { id: 'subsubcategory120', name: '(보완) 현수막', baseTime: 2 },
                            { id: 'subsubcategory121', name: '(보완) ppt', baseTime: 30 },
                            { id: 'subsubcategory122', name: '(보완) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory123', name: '(보완) 명함 & 명찰', baseTime: 4 },
                            { id: 'subsubcategory124', name: '(보완) 행용 초대장 & 순서지', baseTime: 4 },
                            { id: 'subsubcategory125', name: '(보완) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory126', name: '(보완) 휘장', baseTime: 40 },
                            { id: 'subsubcategory127', name: '(보완) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory128', name: '(보완) 사진촬영 플레이지', baseTime: 4 },
                            { id: 'subsubcategory129', name: '(보완) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory130', name: '(보완) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory131', name: '(보완) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory132', name: '(보완) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory133', name: '(보완) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 2 },
                            { id: 'subsubcategory134', name: '(보완) 광고', baseTime: 4 },
                            { id: 'subsubcategory135', name: '(보완) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory136', name: '(보완) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory137', name: '(보완) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory138', name: '(보완) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    }
                ]
            },
            {
                id: 'category4',
                name: '통합헬스케어사업팀_디자인요청',
                subcategories: [
                    {
                        id: 'subcategory7',
                        name: '최초작업',
                        subsubcategories: [
                            { id: 'subsubcategory139', name: '(1차) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory140', name: '(1차) 포스터', baseTime: 4 },
                            { id: 'subsubcategory141', name: '(1차) 배너', baseTime: 2 },
                            { id: 'subsubcategory142', name: '(1차) 팝업', baseTime: 2.7 },
                            { id: 'subsubcategory143', name: '(1차) 현수막', baseTime: 4 },
                            { id: 'subsubcategory144', name: '(1차) ppt', baseTime: 40 },
                            { id: 'subsubcategory145', name: '(1차) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory146', name: '(1차) 명함 & 명찰', baseTime: 8 },
                            { id: 'subsubcategory147', name: '(1차) 행용 초대장 & 순서지', baseTime: 8 },
                            { id: 'subsubcategory148', name: '(1차) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory149', name: '(1차) 휘장', baseTime: 40 },
                            { id: 'subsubcategory150', name: '(1차) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory151', name: '(1차) 사진촬영 플레이지', baseTime: 8 },
                            { id: 'subsubcategory152', name: '(1차) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory153', name: '(1차) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory154', name: '(1차) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory155', name: '(1차) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory156', name: '(1차) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 3 },
                            { id: 'subsubcategory157', name: '(1차) 광고', baseTime: 4 },
                            { id: 'subsubcategory158', name: '(1차) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory159', name: '(1차) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory160', name: '(1차) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory161', name: '(1차) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    },
                    {
                        id: 'subcategory8',
                        name: '수정보완',
                        subsubcategories: [
                            { id: 'subsubcategory162', name: '(보완) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory163', name: '(보완) 포스터', baseTime: 4 },
                            { id: 'subsubcategory164', name: '(보완) 배너', baseTime: 2 },
                            { id: 'subsubcategory165', name: '(보완) 팝업', baseTime: 2 },
                            { id: 'subsubcategory166', name: '(보완) 현수막', baseTime: 2 },
                            { id: 'subsubcategory167', name: '(보완) ppt', baseTime: 30 },
                            { id: 'subsubcategory168', name: '(보완) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory169', name: '(보완) 명함 & 명찰', baseTime: 4 },
                            { id: 'subsubcategory170', name: '(보완) 행용 초대장 & 순서지', baseTime: 4 },
                            { id: 'subsubcategory171', name: '(보완) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory172', name: '(보완) 휘장', baseTime: 40 },
                            { id: 'subsubcategory173', name: '(보완) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory174', name: '(보완) 사진촬영 플레이지', baseTime: 4 },
                            { id: 'subsubcategory175', name: '(보완) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory176', name: '(보완) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory177', name: '(보완) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory178', name: '(보완) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory179', name: '(보완) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 2 },
                            { id: 'subsubcategory180', name: '(보완) 광고', baseTime: 4 },
                            { id: 'subsubcategory181', name: '(보완) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory182', name: '(보완) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory183', name: '(보완) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory184', name: '(보완) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    }
                ]
            },
            {
                id: 'category5',
                name: '통합헬스케어진흥팀_디자인요청',
                subcategories: [
                    {
                        id: 'subcategory9',
                        name: '최초작업',
                        subsubcategories: [
                            { id: 'subsubcategory185', name: '(1차) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory186', name: '(1차) 포스터', baseTime: 4 },
                            { id: 'subsubcategory187', name: '(1차) 배너', baseTime: 2 },
                            { id: 'subsubcategory188', name: '(1차) 팝업', baseTime: 2.7 },
                            { id: 'subsubcategory189', name: '(1차) 현수막', baseTime: 4 },
                            { id: 'subsubcategory190', name: '(1차) ppt', baseTime: 40 },
                            { id: 'subsubcategory191', name: '(1차) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory192', name: '(1차) 명함 & 명찰', baseTime: 8 },
                            { id: 'subsubcategory193', name: '(1차) 행용 초대장 & 순서지', baseTime: 8 },
                            { id: 'subsubcategory194', name: '(1차) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory195', name: '(1차) 휘장', baseTime: 40 },
                            { id: 'subsubcategory196', name: '(1차) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory197', name: '(1차) 사진촬영 플레이지', baseTime: 8 },
                            { id: 'subsubcategory198', name: '(1차) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory199', name: '(1차) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory200', name: '(1차) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory201', name: '(1차) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory202', name: '(1차) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 3 },
                            { id: 'subsubcategory203', name: '(1차) 광고', baseTime: 4 },
                            { id: 'subsubcategory204', name: '(1차) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory205', name: '(1차) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory206', name: '(1차) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory207', name: '(1차) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    },
                    {
                        id: 'subcategory10',
                        name: '수정보완',
                        subsubcategories: [
                            { id: 'subsubcategory208', name: '(보완) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory209', name: '(보완) 포스터', baseTime: 4 },
                            { id: 'subsubcategory210', name: '(보완) 배너', baseTime: 2 },
                            { id: 'subsubcategory211', name: '(보완) 팝업', baseTime: 2 },
                            { id: 'subsubcategory212', name: '(보완) 현수막', baseTime: 2 },
                            { id: 'subsubcategory213', name: '(보완) ppt', baseTime: 30 },
                            { id: 'subsubcategory214', name: '(보완) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory215', name: '(보완) 명함 & 명찰', baseTime: 4 },
                            { id: 'subsubcategory216', name: '(보완) 행용 초대장 & 순서지', baseTime: 4 },
                            { id: 'subsubcategory217', name: '(보완) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory218', name: '(보완) 휘장', baseTime: 40 },
                            { id: 'subsubcategory219', name: '(보완) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory220', name: '(보완) 사진촬영 플레이지', baseTime: 4 },
                            { id: 'subsubcategory221', name: '(보완) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory222', name: '(보완) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory223', name: '(보완) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory224', name: '(보완) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory225', name: '(보완) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 2 },
                            { id: 'subsubcategory226', name: '(보완) 광고', baseTime: 4 },
                            { id: 'subsubcategory227', name: '(보완) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory228', name: '(보완) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory229', name: '(보완) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory230', name: '(보완) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    }
                ]
            },
            {
                id: 'category6',
                name: 'AIT기획팀_디자인요청',
                subcategories: [
                    {
                        id: 'subcategory11',
                        name: '최초작업',
                        subsubcategories: [
                            { id: 'subsubcategory231', name: '(1차) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory232', name: '(1차) 포스터', baseTime: 4 },
                            { id: 'subsubcategory233', name: '(1차) 배너', baseTime: 2 },
                            { id: 'subsubcategory234', name: '(1차) 팝업', baseTime: 2.7 },
                            { id: 'subsubcategory235', name: '(1차) 현수막', baseTime: 4 },
                            { id: 'subsubcategory236', name: '(1차) ppt', baseTime: 40 },
                            { id: 'subsubcategory237', name: '(1차) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory238', name: '(1차) 명함 & 명찰', baseTime: 8 },
                            { id: 'subsubcategory239', name: '(1차) 행용 초대장 & 순서지', baseTime: 8 },
                            { id: 'subsubcategory240', name: '(1차) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory241', name: '(1차) 휘장', baseTime: 40 },
                            { id: 'subsubcategory242', name: '(1차) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory243', name: '(1차) 사진촬영 플레이지', baseTime: 8 },
                            { id: 'subsubcategory244', name: '(1차) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory245', name: '(1차) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory246', name: '(1차) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory247', name: '(1차) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory248', name: '(1차) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 3 },
                            { id: 'subsubcategory249', name: '(1차) 광고', baseTime: 4 },
                            { id: 'subsubcategory250', name: '(1차) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory251', name: '(1차) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory252', name: '(1차) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory253', name: '(1차) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    },
                    {
                        id: 'subcategory12',
                        name: '수정보완',
                        subsubcategories: [
                            { id: 'subsubcategory254', name: '(보완) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory255', name: '(보완) 포스터', baseTime: 4 },
                            { id: 'subsubcategory256', name: '(보완) 배너', baseTime: 2 },
                            { id: 'subsubcategory257', name: '(보완) 팝업', baseTime: 2 },
                            { id: 'subsubcategory258', name: '(보완) 현수막', baseTime: 2 },
                            { id: 'subsubcategory259', name: '(보완) ppt', baseTime: 30 },
                            { id: 'subsubcategory260', name: '(보완) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory261', name: '(보완) 명함 & 명찰', baseTime: 4 },
                            { id: 'subsubcategory262', name: '(보완) 행용 초대장 & 순서지', baseTime: 4 },
                            { id: 'subsubcategory263', name: '(보완) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory264', name: '(보완) 휘장', baseTime: 40 },
                            { id: 'subsubcategory265', name: '(보완) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory266', name: '(보완) 사진촬영 플레이지', baseTime: 4 },
                            { id: 'subsubcategory267', name: '(보완) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory268', name: '(보완) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory269', name: '(보완) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory270', name: '(보완) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory271', name: '(보완) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 2 },
                            { id: 'subsubcategory272', name: '(보완) 광고', baseTime: 4 },
                            { id: 'subsubcategory273', name: '(보완) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory274', name: '(보완) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory275', name: '(보완) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory276', name: '(보완) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    }
                ]
            },
            {
                id: 'category7',
                name: '교육팀_디자인요청',
                subcategories: [
                    {
                        id: 'subcategory13',
                        name: '최초작업',
                        subsubcategories: [
                            { id: 'subsubcategory277', name: '(1차) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory278', name: '(1차) 포스터', baseTime: 4 },
                            { id: 'subsubcategory279', name: '(1차) 배너', baseTime: 2 },
                            { id: 'subsubcategory280', name: '(1차) 팝업', baseTime: 2.7 },
                            { id: 'subsubcategory281', name: '(1차) 현수막', baseTime: 4 },
                            { id: 'subsubcategory282', name: '(1차) ppt', baseTime: 40 },
                            { id: 'subsubcategory283', name: '(1차) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory284', name: '(1차) 명함 & 명찰', baseTime: 8 },
                            { id: 'subsubcategory285', name: '(1차) 행용 초대장 & 순서지', baseTime: 8 },
                            { id: 'subsubcategory286', name: '(1차) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory287', name: '(1차) 휘장', baseTime: 40 },
                            { id: 'subsubcategory288', name: '(1차) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory289', name: '(1차) 사진촬영 플레이지', baseTime: 8 },
                            { id: 'subsubcategory290', name: '(1차) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory291', name: '(1차) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory292', name: '(1차) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory293', name: '(1차) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory294', name: '(1차) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 3 },
                            { id: 'subsubcategory295', name: '(1차) 광고', baseTime: 4 },
                            { id: 'subsubcategory296', name: '(1차) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory297', name: '(1차) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory298', name: '(1차) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory299', name: '(1차) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    },
                    {
                        id: 'subcategory14',
                        name: '수정보완',
                        subsubcategories: [
                            { id: 'subsubcategory300', name: '(보완) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory301', name: '(보완) 포스터', baseTime: 4 },
                            { id: 'subsubcategory302', name: '(보완) 배너', baseTime: 2 },
                            { id: 'subsubcategory303', name: '(보완) 팝업', baseTime: 2 },
                            { id: 'subsubcategory304', name: '(보완) 현수막', baseTime: 2 },
                            { id: 'subsubcategory305', name: '(보완) ppt', baseTime: 30 },
                            { id: 'subsubcategory306', name: '(보완) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory307', name: '(보완) 명함 & 명찰', baseTime: 4 },
                            { id: 'subsubcategory308', name: '(보완) 행용 초대장 & 순서지', baseTime: 4 },
                            { id: 'subsubcategory309', name: '(보완) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory310', name: '(보완) 휘장', baseTime: 40 },
                            { id: 'subsubcategory311', name: '(보완) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory312', name: '(보완) 사진촬영 플레이지', baseTime: 4 },
                            { id: 'subsubcategory313', name: '(보완) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory314', name: '(보완) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory315', name: '(보완) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory316', name: '(보완) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory317', name: '(보완) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 2 },
                            { id: 'subsubcategory318', name: '(보완) 광고', baseTime: 4 },
                            { id: 'subsubcategory319', name: '(보완) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory320', name: '(보완) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory321', name: '(보완) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory322', name: '(보완) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    }
                ]
            },
            {
                id: 'category8',
                name: '기술지원팀_디자인요청',
                subcategories: [
                    {
                        id: 'subcategory15',
                        name: '최초작업',
                        subsubcategories: [
                            { id: 'subsubcategory323', name: '(1차) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory324', name: '(1차) 포스터', baseTime: 4 },
                            { id: 'subsubcategory325', name: '(1차) 배너', baseTime: 2 },
                            { id: 'subsubcategory326', name: '(1차) 팝업', baseTime: 2.7 },
                            { id: 'subsubcategory327', name: '(1차) 현수막', baseTime: 4 },
                            { id: 'subsubcategory328', name: '(1차) ppt', baseTime: 40 },
                            { id: 'subsubcategory329', name: '(1차) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory330', name: '(1차) 명함 & 명찰', baseTime: 8 },
                            { id: 'subsubcategory331', name: '(1차) 행용 초대장 & 순서지', baseTime: 8 },
                            { id: 'subsubcategory332', name: '(1차) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory333', name: '(1차) 휘장', baseTime: 40 },
                            { id: 'subsubcategory334', name: '(1차) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory335', name: '(1차) 사진촬영 플레이지', baseTime: 8 },
                            { id: 'subsubcategory336', name: '(1차) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory337', name: '(1차) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory338', name: '(1차) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory339', name: '(1차) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory340', name: '(1차) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 3 },
                            { id: 'subsubcategory341', name: '(1차) 광고', baseTime: 4 },
                            { id: 'subsubcategory342', name: '(1차) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory343', name: '(1차) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory344', name: '(1차) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory345', name: '(1차) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    },
                    {
                        id: 'subcategory16',
                        name: '수정보완',
                        subsubcategories: [
                            { id: 'subsubcategory346', name: '(보완) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory347', name: '(보완) 포스터', baseTime: 4 },
                            { id: 'subsubcategory348', name: '(보완) 배너', baseTime: 2 },
                            { id: 'subsubcategory349', name: '(보완) 팝업', baseTime: 2 },
                            { id: 'subsubcategory350', name: '(보완) 현수막', baseTime: 2 },
                            { id: 'subsubcategory351', name: '(보완) ppt', baseTime: 30 },
                            { id: 'subsubcategory352', name: '(보완) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory353', name: '(보완) 명함 & 명찰', baseTime: 4 },
                            { id: 'subsubcategory354', name: '(보완) 행용 초대장 & 순서지', baseTime: 4 },
                            { id: 'subsubcategory355', name: '(보완) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory356', name: '(보완) 휘장', baseTime: 40 },
                            { id: 'subsubcategory357', name: '(보완) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory358', name: '(보완) 사진촬영 플레이지', baseTime: 4 },
                            { id: 'subsubcategory359', name: '(보완) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory360', name: '(보완) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory361', name: '(보완) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory362', name: '(보완) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory363', name: '(보완) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 2 },
                            { id: 'subsubcategory364', name: '(보완) 광고', baseTime: 4 },
                            { id: 'subsubcategory365', name: '(보완) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory366', name: '(보완) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory367', name: '(보완) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory368', name: '(보완) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    }
                ]
            },
            {
                id: 'category9',
                name: '디자인_기타업무',
                subcategories: [
                    {
                        id: 'subcategory17',
                        name: '최초작업',
                        subsubcategories: [
                            { id: 'subsubcategory369', name: '(1차) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory370', name: '(1차) 포스터', baseTime: 4 },
                            { id: 'subsubcategory371', name: '(1차) 배너', baseTime: 2 },
                            { id: 'subsubcategory372', name: '(1차) 팝업', baseTime: 2.7 },
                            { id: 'subsubcategory373', name: '(1차) 현수막', baseTime: 4 },
                            { id: 'subsubcategory374', name: '(1차) ppt', baseTime: 40 },
                            { id: 'subsubcategory375', name: '(1차) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory376', name: '(1차) 명함 & 명찰', baseTime: 8 },
                            { id: 'subsubcategory377', name: '(1차) 행용 초대장 & 순서지', baseTime: 8 },
                            { id: 'subsubcategory378', name: '(1차) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory379', name: '(1차) 휘장', baseTime: 40 },
                            { id: 'subsubcategory380', name: '(1차) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory381', name: '(1차) 사진촬영 플레이지', baseTime: 8 },
                            { id: 'subsubcategory382', name: '(1차) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory383', name: '(1차) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory384', name: '(1차) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory385', name: '(1차) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory386', name: '(1차) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 3 },
                            { id: 'subsubcategory387', name: '(1차) 광고', baseTime: 4 },
                            { id: 'subsubcategory388', name: '(1차) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory389', name: '(1차) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory390', name: '(1차) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory391', name: '(1차) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    },
                    {
                        id: 'subcategory18',
                        name: '수정보완',
                        subsubcategories: [
                            { id: 'subsubcategory392', name: '(보완) 키비주얼 레퍼런스 수집 및 아이데이션', baseTime: 32 },
                            { id: 'subsubcategory393', name: '(보완) 포스터', baseTime: 4 },
                            { id: 'subsubcategory394', name: '(보완) 배너', baseTime: 2 },
                            { id: 'subsubcategory395', name: '(보완) 팝업', baseTime: 2 },
                            { id: 'subsubcategory396', name: '(보완) 현수막', baseTime: 2 },
                            { id: 'subsubcategory397', name: '(보완) ppt', baseTime: 30 },
                            { id: 'subsubcategory398', name: '(보완) 책자 & 카탈로그', baseTime: 40 },
                            { id: 'subsubcategory399', name: '(보완) 명함 & 명찰', baseTime: 4 },
                            { id: 'subsubcategory400', name: '(보완) 행용 초대장 & 순서지', baseTime: 4 },
                            { id: 'subsubcategory401', name: '(보완) 홍보물 & DID', baseTime: 4 },
                            { id: 'subsubcategory402', name: '(보완) 휘장', baseTime: 40 },
                            { id: 'subsubcategory403', name: '(보완) 리플렛', baseTime: 40 },
                            { id: 'subsubcategory404', name: '(보완) 사진촬영 플레이지', baseTime: 4 },
                            { id: 'subsubcategory405', name: '(보완) 뉴스레터', baseTime: 16 },
                            { id: 'subsubcategory406', name: '(보완) 협회소개서 내용 업데이트', baseTime: 3 },
                            { id: 'subsubcategory407', name: '(보완) 협회 홈페이지 관리 및 업데이트', baseTime: 3 },
                            { id: 'subsubcategory408', name: '(보완) 홈페이지 제작', baseTime: 145 },
                            { id: 'subsubcategory409', name: '(보완) 인포그래픽 일러스트 작업 (1차 평균 기준)', baseTime: 2 },
                            { id: 'subsubcategory410', name: '(보완) 광고', baseTime: 4 },
                            { id: 'subsubcategory411', name: '(보완) 영상기획', baseTime: 24 },
                            { id: 'subsubcategory412', name: '(보완) 영상촬영', baseTime: 6 },
                            { id: 'subsubcategory413', name: '(보완) 영상편집 (1편)', baseTime: 25 },
                            { id: 'subsubcategory414', name: '(보완) 수정 및 피드백 발송', baseTime: 4 }
                        ]
                    }
                ]
            }
        ]
    }; //414개 디자인팀
    const departmentData4 ={
      name: '교육부서',
      categories: [
        {
          id: 'category1',
          name: '교육운영',
          subcategories: [
            {
              id: 'subcategory1',
              name: '교육계획',
              subsubcategories: [
                { id: 'subsubcategory1', name: '교육운영계획서 자료수집', baseTime: 3 },
                { id: 'subsubcategory2', name: '교육운영계획서 작성', baseTime: 2 },
                { id: 'subsubcategory3', name: '교육과정 설계', baseTime: 5 },
                { id: 'subsubcategory4', name: '교육운영계획서식약처 발송', baseTime: 1 },
              ],
            },
            {
              id: 'subcategory2',
              name: '교육콘텐츠개발',
              subsubcategories: [
                { id: 'subsubcategory5', name: '교육콘텐츠 개발 관련 데이터 취합', baseTime: 8 },
                { id: 'subsubcategory6', name: '교육콘텐츠 개발 관련 계획 작성 및 보고', baseTime: 8 },
                { id: 'subsubcategory7', name: '교육콘텐츠 개발 전문가 위촉', baseTime: 2 },
                { id: 'subsubcategory8', name: '교육콘텐츠 개발 업체 선정', baseTime: 5 },
                { id: 'subsubcategory9', name: '교육콘텐츠 감수', baseTime: 4 },
                { id: 'subsubcategory10', name: '교육콘텐츠 이력서 작성(표준교재)', baseTime: 8 },
                { id: 'subsubcategory11', name: '교육콘텐츠 개정사항 비교표 작성(표준교재)', baseTime: 2 },
                { id: 'subsubcategory12', name: '강의자료 검토', baseTime: 1 },
                { id: 'subsubcategory13', name: '강의자료 요청/수정요청/취합/직접 수정', baseTime: 1 },
                { id: 'subsubcategory14', name: '최신 개정사항 모니터링 및 기록서 작성', baseTime: 1 },
                { id: 'subsubcategory15', name: '강의자료 관리', baseTime: 10 },
              ],
            },
            {
              id: 'subcategory3',
              name: '교육준비',
              subsubcategories: [
                { id: 'subsubcategory16', name: '강의 준비(현장 준비)', baseTime: 1 },
                { id: 'subsubcategory17', name: '강의 안내사항 및 자료 송부', baseTime: 0.5 },
                { id: 'subsubcategory18', name: '강의자료 제본 및 식당 예약', baseTime: 0.5 },
                { id: 'subsubcategory19', name: '교육생 정보 확인', baseTime: 0.2 },
                { id: 'subsubcategory20', name: '교육생 입실 체크', baseTime: 0.2 },
              ],
            },
            {
              id: 'subcategory4',
              name: '교육진행',
              subsubcategories: [
                { id: 'subsubcategory21', name: '온라인교육 송출(문제상황 대처)', baseTime: 8 },
                { id: 'subsubcategory22', name: '교육 운영(문의 응대)', baseTime: 8 },
              ],
            },
            {
              id: 'subcategory5',
              name: '교육후속조치',
              subsubcategories: [
                { id: 'subsubcategory23', name: '교육만족도조사 통계 정리', baseTime: 0.5 },
                { id: 'subsubcategory24', name: '교육수료처리 및 실적보고', baseTime: 0.5 },
                { id: 'subsubcategory25', name: '월별 결과보고서 작성 및 보고', baseTime: 2 },
                { id: 'subsubcategory26', name: '교육운영자 교육 훈련 계획수립', baseTime: 1 },
                { id: 'subsubcategory27', name: '교육운영자 교육 훈련 이수', baseTime: 8 },
                { id: 'subsubcategory28', name: '교육운영자 교육 훈련 결과보고', baseTime: 1 },
              ],
            },
            {
              id: 'subcategory6',
              name: '평가문제',
              subsubcategories: [
                { id: 'subsubcategory29', name: '강사별 평가문제 출제 요청 및 취합', baseTime: 1 },
                { id: 'subsubcategory30', name: '평가문제 검토 및 의견서 작성', baseTime: 0.5 },
                { id: 'subsubcategory31', name: '평가문제 코드 부여', baseTime: 1 },
                { id: 'subsubcategory32', name: '평가문제 등록(교육홈페이지)', baseTime: 0.5 },
                { id: 'subsubcategory33', name: '평가문제 이력관리 대장 작성', baseTime: 0.5 },
                { id: 'subsubcategory34', name: '문제은행 운영방안 마련', baseTime: 1 },
              ],
            },
          ],
        },
        {
          id: 'category2',
          name: '시설_장비관리',
          subcategories: [
            {
              id: 'subcategory7',
              name: '교육홈페이지',
              subsubcategories: [
                { id: 'subsubcategory35', name: 'LMS 강의개설', baseTime: 0.5 },
                { id: 'subsubcategory36', name: '교육홈페이지 오류 및 개선사항 확인(관리자 페이지 포함)', baseTime: 16 },
                { id: 'subsubcategory37', name: '교육홈페이지 수정작업 지시', baseTime: 16 },
                { id: 'subsubcategory38', name: '교육홈페이지 수정작업 검수', baseTime: 16 },
                { id: 'subsubcategory39', name: '개인정보보호 법령 준수 검토', baseTime: 1 },
              ],
            },
            {
              id: 'subcategory8',
              name: '송출_시설장비',
              subsubcategories: [
                { id: 'subsubcategory40', name: '센터 시설 보안 및 점검사항 파일 취합 및 재가공', baseTime: 1 },
                { id: 'subsubcategory41', name: '송출장비 오류 및 개선사항 확인', baseTime: 4 },
                { id: 'subsubcategory42', name: '송출장비 관련 전문가 자문', baseTime: 2 },
                { id: 'subsubcategory43', name: '송출장비 개선 관련 장비 세팅', baseTime: 2 },
                { id: 'subsubcategory44', name: '송출장비 개선 검토(테스트)', baseTime: 2 },
                { id: 'subsubcategory45', name: '송출장비 관리', baseTime: 10 },
                { id: 'subsubcategory46', name: 'VR장비 대여/점검/반납', baseTime: 2 },
              ],
            },
          ],
        },
        {
          id: 'category3',
          name: '강사관리',
          subcategories: [
            {
              id: 'subcategory9',
              name: '강사관리전체',
              subsubcategories: [
                { id: 'subsubcategory47', name: '강의계획서/구비서류 취합', baseTime: 1 },
                { id: 'subsubcategory48', name: '강사별 강의범위 조사 및 취합', baseTime: 0.5 },
                { id: 'subsubcategory49', name: '강사선정 및 배정', baseTime: 0.5 },
                { id: 'subsubcategory50', name: '강사 섭외 / 일정조율', baseTime: 1 },
                { id: 'subsubcategory51', name: '강사위촉자료 수집', baseTime: 1 },
                { id: 'subsubcategory52', name: '강사위촉자료 분석 및 평가', baseTime: 1 },
                { id: 'subsubcategory53', name: '강사 위촉장 발급 / 대장 관리', baseTime: 0.5 },
                { id: 'subsubcategory54', name: '강사 정보 등록(LMS)', baseTime: 0.2 },
                { id: 'subsubcategory55', name: '정기적 강사평가', baseTime: 0.5 },
                { id: 'subsubcategory56', name: '정기적 강사평가 보고 자료 준비', baseTime: 1.5 },
                { id: 'subsubcategory57', name: '강사평가 공문 작성 및 접수', baseTime: 0.1 },
                { id: 'subsubcategory58', name: '강사현황 검토 및 POOL/수준 관리', baseTime: 0.2 },
                { id: 'subsubcategory59', name: '내외부 강사 훈련계획안 작성', baseTime: 2 },
                { id: 'subsubcategory60', name: '내외부강사 훈련결과보고 작성', baseTime: 2 },
                { id: 'subsubcategory61', name: '내부강사 교육이수', baseTime: 6 },
                { id: 'subsubcategory62', name: '전임강사 교육이수', baseTime: 24 },
              ],
            },
          ],
        },
        {
          id: 'category4',
          name: '교육홍보',
          subcategories: [
            {
              id: 'subcategory10',
              name: '교육홍보준비',
              subsubcategories: [
                { id: 'subsubcategory63', name: '홍보계획안 작성', baseTime: 4 },
                { id: 'subsubcategory64', name: '홍보물 초안작성', baseTime: 3 },
                { id: 'subsubcategory65', name: '홍보물 제작(디자인작업)', baseTime: 0 },
                { id: 'subsubcategory66', name: '홍보처 정보 수집', baseTime: 4 }
              ]
            },
            {
              id: 'subcategory11',
              name: '교육홍보진행',
              subsubcategories: [
                { id: 'subsubcategory67', name: '홍보 진행', baseTime: 0.5 }
              ]
            },
            {
              id: 'subcategory12',
              name: '교육홍보_후속조치_결과보고',
              subsubcategories: [
                { id: 'subsubcategory68', name: '홍보 결과 정리 및 보고', baseTime: 1 }
              ]
            }
          ]
        },
        {
          id: 'category5',
          name: '교육팀_행정',
          subcategories: [
            {
              id: 'subcategory13',
              name: '정기회의',
              subsubcategories: [
                { id: 'subsubcategory69', name: '회의자료 작성(HWP)', baseTime: 1 },
                { id: 'subsubcategory70', name: '회의자료 작성(PPT)', baseTime: 5 }
              ]
            },
            {
              id: 'subcategory14',
              name: '지출결의',
              subsubcategories: [
                { id: 'subsubcategory71', name: '결제 건 관련 증빙서류 확인 및 취합 - 증빙 취합이 복잡할 경우', baseTime: 1 },
                { id: 'subsubcategory72', name: '결제 건 관련 증빙서류 확인 및 취합 - 단순지출 증빙일 경우', baseTime: 0.1 },
                { id: 'subsubcategory73', name: '지출결의', baseTime: 0.2 },
                { id: 'subsubcategory74', name: '집행등록(이지바로)', baseTime: 0.5 },
                { id: 'subsubcategory75', name: '집행등록(이나라도움/RCMS)', baseTime: 0.2 },
                { id: 'subsubcategory76', name: '집행등록(NIPA 시스템)', baseTime: 0.1 },
                { id: 'subsubcategory77', name: '예산 변경(더존, 연구관리시스템)', baseTime: 0.5 },
                { id: 'subsubcategory78', name: '지출계획 수립에 대한 행정 처리 소요시간', baseTime: 1 }
              ]
            },
            {
              id: 'subcategory15',
              name: '출장',
              subsubcategories: [
                { id: 'subsubcategory79', name: '출장신청서', baseTime: 0.2 },
                { id: 'subsubcategory80', name: '출장보고서', baseTime: 0.5 }
              ]
            },
            {
              id: 'subcategory16',
              name: '회의록',
              subsubcategories: [
                { id: 'subsubcategory81', name: '사전품의', baseTime: 0.2 },
                { id: 'subsubcategory82', name: '회의록 작성', baseTime: 0.6 }
              ]
            },
            {
              id: 'subcategory17',
              name: '기타',
              subsubcategories: [
                { id: 'subsubcategory83', name: '협회 업무, 근태 결의 등', baseTime: 0.5 }
              ]
            }
          ]
        },
        {
          id: 'category6',
          name: '교육팀_수정검토',
          subcategories: [
            {
              id: 'subcategory18',
              name: '교육팀_수정검토업무', 
              subsubcategories: [
                { id: 'subsubcategory84', name: '간단검토(1시간내)', baseTime: 1 },
                { id: 'subsubcategory85', name: '상세검토(3시간내)', baseTime: 3 }
              ]
            },
          ]
        },
        {
          id: 'category7',
          name: '교육팀_기타',
          subcategories: [
            {
              id: 'subcategory19',
              name: '교육_기타', 
              subsubcategories: [
                { id: 'subsubcategory86', name: '타부서지원', baseTime: 1 },
                { id: 'subsubcategory87', name: '회의참석', baseTime: 1, },
                { id: 'subsubcategory88', name: '수강 신청 현황 정리 및 업데이트', baseTime: 0.5, },
                { id: 'subsubcategory89', name: '수강생 DB 관리 및 업데이트', baseTime: 1, },
                { id: 'subsubcategory90', name: '오프라인 강의장 대관 운영 지원', baseTime: 2, },
                { id: 'subsubcategory91', name: '센터 문의 대응', baseTime: 0.1, }
              ]
            },
          ]
        }           
      ],
    };

    const addDepartmentData = () => {
        db.collection('departments')
            .doc('education')
            .set(departmentData4)
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
