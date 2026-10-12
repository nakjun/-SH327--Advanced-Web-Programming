import { useReducer } from 'react';
import './styles.css';

const products = [
  { id: 1, name: 'Keyboard', price: 50000, icon: '⌨', description: '작업의 시작을 더 가볍게' },
  { id: 2, name: 'Mouse', price: 30000, icon: '◉', description: '손끝에 맞는 편안한 컨트롤' },
  { id: 3, name: 'Monitor', price: 300000, icon: '▣', description: '더 넓게 펼쳐지는 아이디어' },
];

const formatPrice = (price) => `${price.toLocaleString('ko-KR')}원`;

const initialState = { items: [] };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // ADD_ITEM: 이미 담긴 상품은 새 배열과 객체를 만들어 수량을 1 올립니다.
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      // ADD_ITEM: 처음 담는 상품은 수량 1을 붙여 새 배열에 추가합니다.
      return {
        ...state,
        items: [...state.items, { ...product, quantity: 1 }],
      };
    }
    case 'INCREASE_QUANTITY':
      // INCREASE_QUANTITY: 선택한 상품만 새 객체로 바꾸고 수량을 1 올립니다.
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };
    case 'DECREASE_QUANTITY':
      // DECREASE_QUANTITY: 수량이 1보다 클 때만 줄여 최소 수량을 지킵니다.
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      };
    case 'REMOVE_ITEM':
      // REMOVE_ITEM: 선택한 상품을 제외한 새 배열을 만듭니다.
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'CLEAR_CART':
      // CLEAR_CART: 빈 배열을 가진 새 State로 장바구니 전체를 비웁니다.
      return { ...state, items: [] };
    default:
      return state;
  }
}

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="NovaSpark 홈">
            <span className="brand-mark" aria-hidden="true">✦</span>
            <span>NovaSpark</span>
          </a>
          <a className="header-cart" href="#cart-heading">
            Cart <span className="cart-count">{totalQuantity}</span>
          </a>
        </div>
      </header>

      <main id="top" className="page-shell">
        <div className="intro">
          <span className="eyebrow">THE NOVASPARK EDIT</span>
          <h1>좋은 도구가 만드는<br /><span>더 좋은 하루</span></h1>
          <p>아이디어에 집중할 수 있도록, 일상에 꼭 필요한 도구를 모았습니다.</p>
        </div>

        <div className="content-grid">
          <section className="products-section" aria-labelledby="products-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">PICK YOUR ESSENTIALS</p>
                <h2 id="products-heading">상품 목록 <span className="heading-count">03</span></h2>
              </div>
              <span className="section-note">엄선한 세 가지 아이템</span>
            </div>
            <ul className="product-list">
              {products.map((product, index) => (
                <li className="product-card" key={product.id}>
                  <div className={`product-visual product-visual-${product.id}`} aria-hidden="true">
                    <span className="product-icon">{product.icon}</span>
                    <span className="product-index">0{index + 1}</span>
                  </div>
                  <div className="product-details">
                    <span className="product-label">NOVASPARK ESSENTIAL</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-footer">
                      <strong>{formatPrice(product.price)}</strong>
                      <button
                        className="button button-primary"
                        type="button"
                        onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
                      >
                        <span aria-hidden="true">＋</span> Add to Cart
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="cart-panel" aria-labelledby="cart-heading">
            <div className="cart-header">
              <div>
                <p className="section-kicker">YOUR SELECTION</p>
                <h2 id="cart-heading">Cart <span className="cart-heading-count">{totalQuantity}</span></h2>
              </div>
              <span className="cart-symbol" aria-hidden="true">✦</span>
            </div>

            {cart.items.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon" aria-hidden="true">＋</div>
                <p>장바구니가 비어있습니다</p>
                <span>마음에 드는 상품을 담아보세요.</span>
              </div>
            ) : (
              <ul className="cart-list">
                {cart.items.map((item) => (
                  <li className="cart-item" key={item.id}>
                    <div className={`cart-item-visual product-visual-${item.id}`} aria-hidden="true">{item.icon}</div>
                    <div className="cart-item-content">
                      <div className="cart-item-top">
                        <strong>{item.name}</strong>
                        <button
                          className="button button-ghost remove-button"
                          type="button"
                          aria-label={`${item.name} 삭제`}
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                        >
                          Remove
                        </button>
                      </div>
                      <span className="item-unit-price">{formatPrice(item.price)}</span>
                      <div className="cart-item-bottom">
                        <div className="quantity-control" aria-label={`${item.name} 수량 ${item.quantity}`}>
                          <button
                            type="button"
                            aria-label={`${item.name} 수량 감소`}
                            disabled={item.quantity === 1}
                            onClick={() => dispatch({ type: 'DECREASE_QUANTITY', payload: item.id })}
                          >−</button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`${item.name} 수량 증가`}
                            onClick={() => dispatch({ type: 'INCREASE_QUANTITY', payload: item.id })}
                          >＋</button>
                        </div>
                        <strong>{formatPrice(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-summary">
              <div className="summary-row"><span>상품 금액</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="summary-total"><span>총 금액</span><strong>{formatPrice(totalPrice)}</strong></div>
              <button
                className="button button-secondary clear-button"
                type="button"
                disabled={cart.items.length === 0}
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
        <footer className="page-footer"><span>✦ NovaSpark</span><span>Ignite Your Ideas</span></footer>
      </main>
    </>
  );
}
