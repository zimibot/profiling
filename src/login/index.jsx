import { styled } from "solid-styled-components";
import maps from "../assets/images/world_map.png"
import { InputField } from "../component/form/input";
import { ButtonForm } from "../component/form/button";
import { createFormGroup, createFormControl } from "solid-forms";
import { Navigate, useNavigate, } from "@solidjs/router";
import { defaultPathRedirect } from "../helper/_helper.default.path";
import { useAppState } from "../helper/_helper.context";
import axios from "axios";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { createSignal } from "solid-js";


const Container = styled("div")`
  display: flex;
  flex-direction: column;
  background-image: url(${maps});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  justify-content: center;
  align-items: center;
  flex: 1;
  
`;



const LoginPages = () => {
  const navi = useNavigate()
  const [appStore, { update }] = useAppState()
  const [loading, setLoading] = createSignal(false)

  const group = createFormGroup({
    username: createFormControl("", {
      required: true,
    }),
    password: createFormControl("", {
      required: true,
    }),
  });




  const onSubmit = async (d) => {
    d.preventDefault();
    const { username, password } = await group.value;
    // do stuff...

    setLoading(true)

    try {
      let data = { username, password }
      const postLogin = await axios.post(process.env.NODE_ENV === 'production' ? "https://k17tech.com/login" : "http://localhost:3000/login", data, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      localStorage.setItem("token", postLogin.data.token_user)
      update(d => ({ ...d, token: postLogin.data.token_user }))
      navi(defaultPathRedirect.login)
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully'
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Swal.fire({
        title: 'Error!',
        text: error?.response?.data?.message || "ERROR INTERNAL SERVER",
        icon: 'error',
      })

    }
  };


  if (appStore().token) {
    return <Navigate href={defaultPathRedirect.login}></Navigate>
  }



  return <Container>
    <div className="bg-black bg-opacity-10 w-full h-full  bottom-0  fixed backdrop-blur-[2px]"></div>
    <form onSubmit={onSubmit} className="space-y-6 relative p-4 max-w-lg">
      <div className="flex justify-between">
        <h2>//Authentication</h2>
        <div>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.9997 10.6667H22.6663V8.00004C22.6663 4.32004 19.6797 1.33337 15.9997 1.33337C12.3197 1.33337 9.33301 4.32004 9.33301 8.00004V10.6667H7.99967C6.53301 10.6667 5.33301 11.8667 5.33301 13.3334V26.6667C5.33301 28.1334 6.53301 29.3334 7.99967 29.3334H23.9997C25.4663 29.3334 26.6663 28.1334 26.6663 26.6667V13.3334C26.6663 11.8667 25.4663 10.6667 23.9997 10.6667ZM15.9997 22.6667C14.533 22.6667 13.333 21.4667 13.333 20C13.333 18.5334 14.533 17.3334 15.9997 17.3334C17.4663 17.3334 18.6663 18.5334 18.6663 20C18.6663 21.4667 17.4663 22.6667 15.9997 22.6667ZM20.133 10.6667H11.8663V8.00004C11.8663 5.72004 13.7197 3.86671 15.9997 3.86671C18.2797 3.86671 20.133 5.72004 20.133 8.00004V10.6667Z" fill="white" />
          </svg>
        </div>
      </div>
      <div className="space-y-6">
        <InputField control={group.controls.username} placeholder="John doe" label={"Username*"}></InputField>
        <InputField control={group.controls.password} type="password" placeholder="*********" label={"Password*"}></InputField>
      </div>
      <div class="grid grid-cols-3 gap-4 items-center">
        <ButtonForm disabled={loading} w={"100%"} p={2} loading={loading} teks={"SUBMIT"}></ButtonForm>
        <div className="col-span-2">
          <div className="flex  text-sm items-center justify-center gap-4">
            <div>
              <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.70801 35.8751H39.2913L20.4997 3.41675L1.70801 35.8751ZM22.208 30.7501H18.7913V27.3334H22.208V30.7501ZM22.208 23.9167H18.7913V17.0834H22.208V23.9167Z" fill="white" />
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <span>FORGOT THE PASSWORD?</span> <span>PLEASE CONTACT YOUR ADMINISTRATOR</span>
            </div>
          </div>
        </div>
        <div className="col-span-full">
          This software is exclusively intended for use by authorized personnel, and any unauthorized use of this application is considered a violation of legal regulations. The software's functions can only be accessed by individuals with the necessary authorization. Unauthorized usage, whether by individuals or organizations, without the required permissions, constitutes a legal infringement.
        </div>
      </div>

    </form>
  </Container >
}


export default LoginPages