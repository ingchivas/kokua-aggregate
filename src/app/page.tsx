"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MailIcon from '@mui/icons-material/Mail';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';
const pacienteRoute = process.env.NEXT_PUBLIC_PACIENTE_URL || 'https://google.com';
const ejecutivoRoute = process.env.NEXT_PUBLIC_EJECUTIVO_URL || 'https://google.com';
const administradorRoute = process.env.NEXT_PUBLIC_ADMINISTRADOR_URL || 'http://localhost:3000';
const proveedorRoute = process.env.NEXT_PUBLIC_PROVEEDOR_URL || 'http://localhost:3000';
const medicoRoute = process.env.NEXT_PUBLIC_MEDICO_URL || 'https://google.com';


function Home() {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Function to handle redirection based on user type
  const navigateTo = (tipoAcceso: any) => {
    switch (tipoAcceso) {
      case 'Paciente':
        router.push(pacienteRoute);
        break;
      case 'Ejecutivo':
        router.push(ejecutivoRoute);
        break;
      case 'Administrador':
        router.push(`${administradorRoute}/sign-in?username=${username}`);
        break;
      case 'Proveedor':
        router.push(`${proveedorRoute}/sign-in?username=${username}`);
        break;
      case 'Medico':
        router.push(medicoRoute);
        break;
      default:
        toast.error('Usuario no está dado de alta. Por favor, contacte a soporte.');
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log('Login attempt with:', { username, password });
    try {
      const loginResponse = await fetch(`${apiRoute}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const loginResult = await loginResponse.json();

      if (loginResult.error) {
        toast.error('Error en el login. Por favor, intente nuevamente.');
      } else if (loginResult.result) {
        navigateTo(loginResult.TipoAcceso);
      }
    } catch (error) {
      console.error('Error during login', error);
      toast.error('Error en el login. Por favor, intente nuevamente.');
    }
  };

  const handleSubmit = async (e: any) => {
    console.log('Checking access type for:', username);
    e.preventDefault();
    try {
      const response = await fetch(`${apiRoute}/api/users/getTipoAcceso/${username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.tipoAcceso === 'Administrador' || data.tipoAcceso === 'Proveedor') {
        toast.info(`Cargando ${data.tipoAcceso}`);
        navigateTo(data.tipoAcceso);
      }
      if (data.error) {
        toast.error('El usuario no existe. Por favor, intente nuevamente.');
      }

      else {
        setTimeout(() => {
          toast.info('Ingrese su contraseña para continuar.');
        }, 1000);
        setShowPassword(true);
      }
    } catch (error) {
      console.error('Error al verificar el tipo de acceso', error);
      toast.error('Error al verificar el tipo de acceso. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 text-black">
      <div className="flex-col ">
        <div className="bg-white rounded-lg p-8 shadow-md text-center flex flex-col items-center px-28">
          <Image
            src="/img/KokuaLogo.png"
            alt="403"
            width={200}
            height={200}
          />

          <h1 className="text-3xl font-bold mt-5">Bienvenido a Kokua</h1>

          <form className="w-full mt-8" onSubmit={showPassword ? handleLogin : handleSubmit}>
            <label htmlFor="username" className="block text-gray-700 text-xs font-bold mb-2">Ingresa tu username para continuar</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            {showPassword && (
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            )}



            {!showPassword && (
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Continuar
              </button>
            )}
            {showPassword && (
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Ingresar
              </button>
            )}


          </form>
          <p className="text-xs mt-4">¿No tienes cuenta? <a href="https://admin.kokuahealth.tech/Registro" className="text-blue-500"><AssignmentIndIcon /> Regístrate</a></p>
          <p className="text-xs mt-4">¿Tienes problemas? <a href="mailto:joseemiliokuri@gmail.com" className="text-blue-500"><MailIcon /> Contáctanos</a></p>

        </div>

      </div>
      <ToastContainer />
    </div>
  );
}


export default Home;
