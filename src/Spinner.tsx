/** @jsxImportSource @emotion/react */
import React, { PropsWithChildren } from 'react';
import { css } from '@emotion/react';
import ReactDOM from 'react-dom/client';
import { v4 as uuid } from 'uuid';

interface IContextValue {
  showLoadingSpinner: () => () => void;
}

const waitStype = css`
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  padding: 0.5rem;
  background-color: #fcf7d1;
  border: 1px solid #eacb6b;
  border-radius: 4px;
  text-align: center;
  z-index: 10000;
  font-size: 14px;
`;
//background-color: #e5f0ff;
//border: 1px solid #b6d4fe;

class SpinnerControl extends Set<string> {
  private root: ReactDOM.Root;

  constructor() {
    super();
    document.getElementById('loading-wait')?.remove();
    const mountPoint = document.createElement('div');
    mountPoint.id = 'loading-wait';
    document.body.append(mountPoint);
    this.root = ReactDOM.createRoot(mountPoint);
  }

  private addElement(id: string) {
    if (this.size === 0) {
      this.root.render(
        <div css={waitStype}>
          <span className="spinner-border spinner-border-sm ms-2" role="status"></span>
          <span className="mx-3">Загрузка...</span>
        </div>,
      );
    }
    this.add(id);
  }

  private deleteElement(id: string) {
    this.delete(id);
    if (this.size < 1) this.root.render(null);
  }

  get contextValue() {
    const showLoadingSpinner = () => {
      const id = uuid();
      this.addElement(id);
      return () => {
        this.deleteElement(id);
      };
    };
    return { showLoadingSpinner };
  }
}
const spinnerControl = new SpinnerControl();

const LoadingSpinnerContext = React.createContext<IContextValue>(spinnerControl.contextValue);

const useLoadingSpinnerControl = () => React.useContext(LoadingSpinnerContext);

const LoadingSpinnerProvider: React.FC<PropsWithChildren> = ({ children }) => (
  <LoadingSpinnerContext.Provider value={spinnerControl.contextValue}>{children}</LoadingSpinnerContext.Provider>
);

export { LoadingSpinnerProvider, useLoadingSpinnerControl };