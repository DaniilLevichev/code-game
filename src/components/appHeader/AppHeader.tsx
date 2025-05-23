import { useRef, useState } from "react";
import mainStyles from "./AppHeader.module.css";
import { NavLink } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import logo from "../../../public/assets/logo.png";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

export default function AppHeader() {
  const login = sessionStorage.getItem("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registryModal, setRegistryModal] = useState(false);
  const [authorizationModal, setAuthorizationModal] = useState(false);
  const toast = useRef<Toast>(null);

  const doRegistry = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      toast.current?.show({
        severity: "success",
        summary: "Регистрация",
        detail: "Регистрация прошла успешно",
      });
      setRegistryModal(false);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Ошибка",
        detail: error as string,
      });
    }
  };

  const doLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      toast.current?.show({
        severity: "success",
        summary: "Авторизация",
        detail: "Авторизация прошла успешно",
      });

      sessionStorage.setItem("login", username);

      setAuthorizationModal(false);
    } catch (error) {
      console.log(error);
      toast.current?.show({
        severity: "error",
        summary: "Ошибка",
        detail: error as any,
      });
    }
  };

  return (
    <header>
      <nav className={mainStyles.background}>
        <section className={mainStyles.section}>
          <NavLink to="/">
            <p className={` text text_type_main-default ml-6`}>Главная</p>
          </NavLink>
          <div style={{ paddingLeft: "130px" }}>
            <img src={logo} alt="logo" width="200px" height="200px" />
          </div>
          {login ? (
            <div className="mr-6">
              <i className="pi pi-user mr-2" style={{ fontSize: "1rem" }}></i>
              {login}
            </div>
          ) : (
            <div className="flex align-items-center mr-6 gap-4">
              <NavLink to="#" onClick={() => setRegistryModal(true)}>
                <p className={`${mainStyles.text} text text_type_main-default`}>
                  Зарегистрироваться
                </p>
              </NavLink>
              |
              <NavLink to="#" onClick={() => setAuthorizationModal(true)}>
                <p className={`${mainStyles.text} text text_type_main-default`}>
                  Войти
                </p>
              </NavLink>
            </div>
          )}
        </section>
      </nav>
      <Dialog
        header="Регистрация"
        visible={registryModal}
        className="p-button-lg p-button-rounded"
        onHide={() => setRegistryModal(false)}
        style={{ width: "30vw", height: "50vh" }}
        footer={
          <div className="flex w-full justify-content-center pt-4">
            <Button onClick={() => doRegistry()}>Зарегестрироваться</Button>
            <Button onClick={() => setRegistryModal(false)}>Закрыть</Button>
          </div>
        }
      >
        <div className={mainStyles.mainDiv}>
          <form className="flex flex-column align-items-center">
            <div className={mainStyles.input}>
              <InputText
                value={username}
                placeholder={"Имя"}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={mainStyles.input}>
              <InputText
                value={password}
                placeholder={"Пароль"}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
          <div className={mainStyles.linkText}>
            <p className="text text_type_main-default text_color_inactive">
              Уже зарегистрированы?
            </p>
            <NavLink
              to="#"
              className={mainStyles.link}
              onClick={() => {
                setRegistryModal(false);
                setAuthorizationModal(true);
              }}
            >
              Войти
            </NavLink>
          </div>
        </div>
      </Dialog>
      <Dialog
        header="Вход"
        visible={authorizationModal}
        className="p-button-lg p-button-rounded"
        onHide={() => setAuthorizationModal(false)}
        style={{ width: "30vw", height: "50vh" }}
        footer={
          <div className="flex w-full justify-content-center pt-4">
            <Button onClick={() => doLogin()}>Войти</Button>
            <Button onClick={() => setAuthorizationModal(false)}>
              Закрыть
            </Button>
          </div>
        }
      >
        <div className={mainStyles.mainDiv}>
          <form className="flex flex-column align-items-center">
            <div className={mainStyles.input}>
              <InputText
                value={username}
                placeholder={"Имя"}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={mainStyles.input}>
              <InputText
                value={password}
                placeholder={"Пароль"}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
          <div className={mainStyles.linkText}>
            <p className="text text_type_main-default text_color_inactive">
              Вы - новый пользователь?
            </p>
            <NavLink
              to="#"
              className={mainStyles.link}
              onClick={() => {
                setAuthorizationModal(false);
                setRegistryModal(true);
              }}
            >
              Зарегестрироваться
            </NavLink>
          </div>
        </div>
      </Dialog>
      <Toast ref={toast} />
    </header>
  );
}
