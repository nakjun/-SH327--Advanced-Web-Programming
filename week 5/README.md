# StudentCard로 배우는 React

이 폴더의 App.jsx와 StudentCard.jsx는 각 카드에 독립적인 좋아요 State를 추가한 3단계 코드입니다. Props로 학생 정보를 전달하고, 버튼을 클릭하면 해당 카드의 좋아요 수가 1씩 증가합니다.
React와 Vite 실행 환경이 포함되어 있습니다. 이 폴더에서 아래 명령을 실행하세요.

```powershell
npm install
npm run dev
```

터미널에 표시되는 로컬 주소를 브라우저에서 열면 됩니다. 서버 종료는 Ctrl+C입니다.
`npm run build`는 배포용 파일을 dist 폴더에 생성합니다.
main.jsx가 App을 HTML의 root 영역에 렌더링합니다.

## 1단계: Component

처음에는 Props와 State 없이 고정된 정보를 표시합니다.

```jsx
// StudentCard.jsx
export default function StudentCard() {
  return (
    <article>
      <h2>김민수</h2>
      <p>학과: 컴퓨터공학과</p>
      <p>학년: 2학년</p>
    </article>
  );
}
```

```jsx
// App.jsx
import StudentCard from './StudentCard';

export default function App() {
  return (
    <main>
      <h1>학생 프로필</h1>
      <StudentCard />
      <StudentCard />
      <StudentCard />
    </main>
  );
}
```

Component는 화면을 구성하는 재사용 가능한 단위입니다.
Function Component는 JSX를 반환하는 함수이며, 위 예제에서는 같은 학생 카드가 세 번 표시됩니다.

## 2단계: Props

StudentCard.jsx를 다음과 같이 변경합니다.

```jsx
// Props 받기: 구조 분해 할당
export default function StudentCard({ name, major, grade }) {
  return (
    <article>
      {/* Props 사용: 전달받은 값을 화면에 표시 */}
      <h2>{name}</h2>
      <p>학과: {major}</p>
      <p>학년: {grade}학년</p>
    </article>
  );
}
```

```jsx
// App.jsx
import StudentCard from './StudentCard';

export default function App() {
  return (
    <main>
      <h1>학생 프로필</h1>
      {/* Props 전달: 학생마다 다른 값을 지정 */}
      <StudentCard name="김민수" major="컴퓨터공학과" grade={2} />
      <StudentCard name="이서연" major="경영학과" grade={3} />
      <StudentCard name="박지훈" major="디자인학과" grade={1} />
    </main>
  );
}
```

왜 Props가 필요한가?
Props는 부모가 자식 컴포넌트에 데이터를 전달하는 방법입니다.
같은 카드 구조에 다른 정보를 넣을 수 있어 학생마다 컴포넌트를 새로 작성할 필요가 없습니다.
자식은 전달받은 Props를 직접 수정하지 않고 읽어서 사용합니다.

## 3~4단계: State와 최종 코드

StudentCard에 useState와 좋아요 버튼을 추가한 코드는 StudentCard.jsx에서 확인할 수 있습니다.
useState(0)는 각 카드에 초기값이 0인 likes 상태를 만듭니다.
세 카드가 같은 함수를 사용해도 각 렌더링 인스턴스의 상태는 독립적입니다.
첫 번째 카드를 두 번 클릭하면 좋아요는 순서대로 2, 0, 0입니다.
이어서 두 번째 카드를 한 번 클릭하면 2, 1, 0입니다.
새로고침하면 상태는 다시 초기값 0이 됩니다.

| 개념 | 역할 | 이 예제 |
| --- | --- | --- |
| Component | 재사용 가능한 화면 단위 | StudentCard 함수가 학생 카드 구조를 반환 |
| Props | 부모에게서 전달받는 읽기 전용 데이터 | App이 전달한 name, major, grade |
| State | 컴포넌트가 기억하며 변경할 수 있는 데이터 | 각 카드의 likes |
| Event | 클릭 같은 사용자 동작에 대한 이벤트 | onClick으로 handleLike 실행 |
| Re-render | 상태 변경 등에 따라 컴포넌트를 다시 실행해 JSX를 계산 | 변경된 likes를 포함한 JSX 생성 |

```text
사용자 클릭 → State 변경 → Re-render → 화면 업데이트
            setLikes     StudentCard     좋아요 숫자 변경
```

