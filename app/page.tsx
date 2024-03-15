"use client"
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"




interface Task {
  _id: string;
  name: string;
  todo:string;
  status: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [todoTask, setTodo] = useState('');
  const [nameUpdate, setNameUpdate] = useState<string>('');
  const [todoUpdate, setTodoUpdate] = useState<string>('');
  const [status, setStatus] = useState('Ongoing');
  const { toast } = useToast()
  const [loading, setLoading] = useState(true);

  
  //get all task
  const  getTasks = async () => {
      try {
        const res = await axios.get('https://weak-hare-visor.cyclic.app/api/user/getalldata');
        setTasks(res.data);
        console.log(res.data)
        setLoading(false);          
      } catch (error) {
      console.error('Error fetching data:', error);
        
      }
    }
    useEffect (() => {
    getTasks();
  },[]);

  //add task
   const create = async (newTask: any) => {
    try {
       const newTask = {
        name: newTaskText,
        todo: todoTask,
        status: status
      };
      const res = await axios.post('https://weak-hare-visor.cyclic.app/api/user/create', newTask)
      setTasks([...tasks, res.data]);
      setNewTaskText('');
      setTodo('');
      toast({
          title: "Success",
          description: "New task is succesfully added.",
        })
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
          title: "Failed",
          description: "Error saving the task.",
        })
    }
  };

  // delete task
  const deleteTask = async (taskId: any) => {
    try {
      const res = await axios.delete(`https://weak-hare-visor.cyclic.app/api/user/delete/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully.",
      });

    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
      });
    }
  };

 const updateTask = async (taskId: string, updatedTask: { name?: string; todo?: string; status?: string }, todo: Task) => {
  try {
    const { name, todo: todoUpdate, status } = updatedTask; // Destructure for clarity

    const updatedFields = {
      name: name || undefined, // Set name to undefined if not provided
      todo: todoUpdate || undefined,
      status,
    };
    const res = await axios.put(`https://weak-hare-visor.cyclic.app/api/user/update/${taskId}`, updatedFields);
    const updatedTaskData = res.data;

    setTasks((tasks) =>
      tasks.map((task) => (task._id === taskId ? updatedTaskData : task))
    );

    toast({
      title: "Success",
      description: "Task updated successfully.",
    });
    setNameUpdate('');
    setTodoUpdate('');

  } catch (error) {
    console.error('Error updating task:', error);
    toast({
      title: "Error",
      description: "Failed to update task.",
    });
  }
};

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    create
  }

 
  return(
    <div className=" flex flex-col items-center justify-center w-screen h-full py-10">
      <div className="  flex flex-col items-center justify-center gap-4 w-[80%] md:w-[60%] lg:w-[500px] h-full">
        <div className=" flex items-center justify-between px-10 md:px-20 w-full h-[150px] border-2 rounded-lg">
          <div className=" flex flex-col">
            <h1 className=" text-2xl font-bold">Task Done</h1>
            <p className=" text-zinc-500 text-xs">Keep it up</p>
          </div>
          <div className=" flex items-center justify-center h-24 w-24 rounded-full bg-[#FF5631]">
            <h1 className=" font-bold text-3xl">{tasks.filter((task) => task.status === "Finished").length}/{tasks.length}</h1>
          </div>
        </div>
        <Dialog>
          <DialogTrigger className=" w-full">
             <div className=" flex items-center justify-between w-full">
              <button className=" h-12 w-full rounded-md bg-[#FF5631] text-center">Add Task</button>
            </div>
          </DialogTrigger>
          <DialogContent className=" p-10">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
             <div >
              <form onSubmit={handleSubmit} className=" flex flex-col items-center gap-4 w-full mt-2">
                <Input placeholder="Task name..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} required/>
                <Textarea value={todoTask} onChange={(e) => setTodo(e.target.value)} placeholder="Task todo..." required/>
                <button type="submit" onClick={create} className=" h-10 w-full rounded-md bg-[#FF5631] text-center">Add Task</button>
              </form>
            </div>
          </DialogContent>
        </Dialog>

       
        <div className=" flex flex-col items-center gap-4 w-full">
          { loading ? (
            <div className=" w-full">
              <Skeleton className=" w-full h-10" />
              
            </div>
          ) :(
            <>
              { tasks.map(( todo, idx) => (
                <div key={idx} className=" flex items-center justify-between px-6 py-4 w-full border-2 bg-zinc-900 rounded-lg">
                  <div className=" flex flex-col gap-1 ">
                    <h1 className=" text-xl">{todo.name}</h1>
                    <p className={`text-xs ${todo.status === 'Ongoing' ? 'text-red-600' : 'text-green-600'}`}>{todo.status}</p>
                  </div>
                  <div className=" flex items-center gap-4">
                    <Dialog>
                      <DialogTrigger>
                        <FiEdit size={20}/>
                      </DialogTrigger>
                      <DialogContent className=" p-10">
                        <DialogHeader>
                          <DialogTitle>Update Task</DialogTitle>
                        </DialogHeader>
                        <div className=" flex flex-col items-center gap-4 w-full mt-2">
                          <Input placeholder={todo.name} value={nameUpdate} onChange={(e) => setNameUpdate(e.target.value)}/>
                          <Textarea value={todoUpdate} onChange={(e) => setTodoUpdate(e.target.value)} placeholder={todo.todo}/>
                          <button onClick={() => updateTask(todo._id,{ name: nameUpdate, todo: todoUpdate }, todo)} className=" h-10 w-full rounded-md bg-[#FF5631] text-center">Update Task</button>
                          <button onClick={() => updateTask(todo._id,{ status: 'Finished'}, todo)} className=" h-10 w-full rounded-md border-2 text-center">Finished Task</button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <AiOutlineDelete size={20} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle><p className=" text-lg">Are you absolutely sure to delete <span className=" text-[#FF5631]">{todo.name}</span> task?</p></AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your task
                            and remove the data from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteTask(todo._id)} className=" text-white bg-red-700">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </div>
              ))}
            </>
          )}
          
          
        </div>
      </div>
    </div>
  )
}