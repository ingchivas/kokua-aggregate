"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MailIcon from '@mui/icons-material/Mail';

const apiRoute = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';
const pacienteRoute = process.env.NEXT_PUBLIC_PACIENTE_URL || 'https://google.com';
const ejecutivoRoute = process.env.NEXT_PUBLIC_EJECUTIVO_URL || 'https://google.com';
const administradorRoute = process.env.NEXT_PUBLIC_ADMINISTRADOR_URL || 'http://localhost:3000';
const proveedorRoute = process.env.NEXT_PUBLIC_PROVEEDOR_URL || 'http://localhost:3000';
const medicoRoute = process.env.NEXT_PUBLIC_MEDICO_URL || 'https://google.com';


function Home() {

  const router = useRouter()

  const [username, setUsername] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiRoute}/api/users/getTipoAcceso/${username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const tipoAcceso = await response.json();

      if (!tipoAcceso) {
        toast.error('Usuario no está dado de alta. Por favor, contacte a soporte.');
      } else {
        switch (tipoAcceso) {
          case 'Paciente':
            window.location.href = pacienteRoute;
            break;
          case 'Ejecutivo':
            window.location.href = ejecutivoRoute;
            break;
          case 'Administrador':
            window.location.href = `${administradorRoute}/sign-in?username=${username}`;
            break;
          case 'Proveedor':
            window.location.href = `${proveedorRoute}/sign-in?username=${username}`;
            break;
          case 'Medico':
            window.location.href = medicoRoute;
            break;
          default:
            toast.error('Usuario no está dado de alta. Por favor, contacte a soporte.');
        }
      }
    } catch (error) {
      console.error('Hubo un error al realizar la solicitud', error);
    }
  }

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

          <form onSubmit={handleSubmit} className="w-full mt-8">
            <label htmlFor="username" className="block text-gray-700 text-xs font-bold mb-2">Ingresa tu username para continuar</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition ease-in-out duration-150"
            >
              Continuar
            </button>
          </form>
          <p className="text-xs mt-4">¿Necesitas ayuda? <a href="mailto:joseemiliokuri@gmail.com" className="text-blue-500"><MailIcon /> Contáctanos</a></p>
        </div>

      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
