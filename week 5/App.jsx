import StudentCard from './StudentCard';

export default function App() {
  return (
    <main>
      <h1>학생 프로필</h1>
      {/* Props 전달: 같은 StudentCard에 서로 다른 학생 정보를 전달합니다. */}
      <StudentCard name="김민수" major="컴퓨터공학과" grade={2} />
      <StudentCard name="이서연" major="경영학과" grade={3} />
      <StudentCard name="박지훈" major="디자인학과" grade={1} />
    </main>
  );
}
