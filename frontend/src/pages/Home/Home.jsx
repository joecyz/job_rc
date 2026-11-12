import MainLayout from "../../layouts/MainLayout";

function Home() {
  const username = localStorage.getItem("username");

  return (
    <MainLayout>
      <h1>Home Page</h1>

      <h3>Welcome {username}</h3>
    </MainLayout>
  );
}

export default Home;