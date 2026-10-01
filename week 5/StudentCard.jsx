import { useState } from 'react';

// Props 받기: 전달받은 name, major, grade를 구조 분해 할당합니다.
export default function StudentCard({ name, major, grade }) {
  // 학과와 학년은 이 카드의 State로 관리해 수정한 값을 화면에 반영합니다.
  const [currentMajor, setCurrentMajor] = useState(major);
  const [currentGrade, setCurrentGrade] = useState(grade);
  const [draftMajor, setDraftMajor] = useState(major);
  const [draftGrade, setDraftGrade] = useState(String(grade));
  const [isEditing, setIsEditing] = useState(false);

  // useState: 각 카드가 독립적으로 기억하는 likes 상태를 만들며, 초기값은 0입니다.
  const [likes, setLikes] = useState(0);
  // liked: 이 카드에 현재 좋아요를 눌렀는지 기억합니다.
  const [liked, setLiked] = useState(false);

  function handleLike() {
    // 이미 눌렀다면 좋아요를 취소하고, 아직 누르지 않았다면 추가합니다.
    if (liked) {
      setLikes((previousLikes) => previousLikes - 1);
      setLiked(false);
    } else {
      setLikes((previousLikes) => previousLikes + 1);
      setLiked(true);
    }

    // Re-render: 상태가 바뀌면 React가 이 컴포넌트를 다시 실행하여
    // 새 JSX를 계산하고 버튼 문구와 좋아요 숫자를 업데이트합니다.
  }

  function handleEdit() {
    // 수정창을 열 때 현재 정보를 입력창에 채웁니다.
    setDraftMajor(currentMajor);
    setDraftGrade(String(currentGrade));
    setIsEditing(true);
  }

  function handleApply(event) {
    event.preventDefault();

    const nextMajor = draftMajor.trim();
    const nextGrade = Number(draftGrade);

    // 빈 학과나 1~4 범위를 벗어난 학년은 적용하지 않습니다.
    if (!nextMajor || !Number.isInteger(nextGrade) || nextGrade < 1 || nextGrade > 4) {
      return;
    }

    setCurrentMajor(nextMajor);
    setCurrentGrade(nextGrade);
    setIsEditing(false);
  }

  return (
    <article>
      {/* Props 사용: 전달받은 학생 정보를 JSX에 표시합니다. */}
      <h2>{name}</h2>
      {isEditing ? (
        <form onSubmit={handleApply}>
          <p>
            <label>
              학과:{' '}
              <input
                type="text"
                value={draftMajor}
                onChange={(event) => setDraftMajor(event.target.value)}
                required
              />
            </label>
          </p>
          <p>
            <label>
              학년:{' '}
              <input
                type="number"
                min="1"
                max="4"
                step="1"
                value={draftGrade}
                onChange={(event) => setDraftGrade(event.target.value)}
                required
              />
            </label>
          </p>
          <button type="submit">적용하기</button>
        </form>
      ) : (
        <>
          <p>학과: {currentMajor}</p>
          <p>학년: {currentGrade}학년</p>
          <button type="button" onClick={handleEdit}>수정</button>
        </>
      )}

      <button type="button" onClick={handleLike}>
        {liked ? `💛 좋아요 취소 (${likes})` : `👍 좋아요 (${likes})`}
      </button>
    </article>
  );
}

