export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 부분 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            🚀 2026 캡스톤 대박 기원 방명록
          </h1>
          <p className="text-gray-600">팀원들과 함께 성공적인 프로젝트를 만들어보자구리!</p>
        </header>

        {/* 입력 폼 부분 */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="이름을 입력하구리" 
              className="border p-2 rounded-md"
            />
            <textarea 
              placeholder="응원 메시지를 남겨주구리" 
              className="border p-2 rounded-md h-24"
            />
            <button className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
              등록하기
            </button>
          </div>
        </section>

        {/* 방명록 리스트 부분 (임시 데이터) */}
        <section className="space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm border-l-4 border-blue-500">
            <p className="font-bold">작성자: 김철수</p>
            <p className="text-gray-700">우리 팀 끝까지 화이팅하구리!</p>
          </div>
        </section>
      </div>
    </main>
  );
}