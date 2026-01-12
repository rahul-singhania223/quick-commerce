import { Navbar } from "../components/navbar";
import PageComponent from "./page-component";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  return <PageComponent storeId={storeId} />;
}
