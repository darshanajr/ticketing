import "bootstrap/dist/css/bootstrap.css";
import axiosClient from "../api/build-client";
import Header from "../components/header";

export default function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  const { data } = await axiosClient(appContext.ctx)
    .get("/api/users/current-user")
    .catch((err) => {
      console.log(err);
    });

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      axiosClient(appContext.ctx),
      data.currentUser
    );
  }
  return { pageProps, ...data };
};
