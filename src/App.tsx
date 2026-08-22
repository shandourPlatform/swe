import { StoreProvider } from "./admin/store";
import { ToastProvider } from "./admin/ui";
import Shell from "./admin/Shell";

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </StoreProvider>
  );
}
