import Header from "../components/header";
import FormContainer from "./form-container";

export default function CreatePage() {
  return (
    <div className="flex flex-col">
      <Header />

      <div className="p-0 lg:p-6 min-h-[calc(100vh-64px)] flex flex-col">
        <FormContainer />
      </div>
    </div>
  );
}
