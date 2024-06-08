/* eslint-disable no-unused-vars */
import toast from "react-hot-toast";
import {useEffect, useState} from 'react'

const useErrors = (errors = []) => {
    useEffect(() => {
        errors.forEach(({ isError, error, fallback }) => {
          if (isError) {
            if (fallback) fallback();
            else toast.error(error?.data?.message || "Something went wrong");
          }
        });
      }, [errors]);
};

const useAsyncMutate = (mutatationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutatationHook();

  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updating data...");

    try {
      const res = await mutate(...args);

      if (res.data) {
        toast.success(res.data.message || "Updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

const useSocketEventsHandler = (socket, listners) => {
  useEffect(()=>{
    Object.entries(listners).forEach(([event, listner])=>{
      socket.on(event, listner);
      //console.log();
    })

    return ()=>{
      Object.entries(listners).forEach(([event, listner])=>{
        socket.off(event, listner);
      });
    };
  }, [socket, listners]);
}

export { useErrors , useSocketEventsHandler, useAsyncMutate }