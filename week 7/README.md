# 7주차: Shopping Cart UI

React Function Component와 JSX로 상품 목록 3개와 Cart 영역을 표시합니다.

`useReducer`의 `ADD_ITEM` Action으로 상품을 Cart에 담습니다. 처음 담으면 수량이 1이고, 같은 상품을 다시 담으면 수량이 1씩 증가합니다. Cart가 비어 있을 때는 `장바구니가 비어있습니다`를 표시합니다.

Cart에서 `+`와 `-`로 수량을 변경하고, `Remove`로 상품을 삭제하거나 `Clear Cart`로 전체를 비울 수 있습니다. 수량은 1 아래로 내려가지 않습니다. 총 금액은 각 상품의 가격과 수량을 곱해 합산합니다. 모든 상태 변경은 `cartReducer`의 Action으로 처리합니다.

## 실행

```powershell
npm install
npm run dev
```
