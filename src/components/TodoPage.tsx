import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [editingTask, setEditingTask] = useState<{ id: number; name: string } | null>(null);

  const handleFetchTasks = async () => {
    try {
      const fetchedTasks = await api.get('/tasks');
      console.log('Fetched tasks:', fetchedTasks); // Debug log
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      handleFetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingTask) {
        if (editingTask.name.trim() === '') {
          alert('Task name is required');
          return;
        }

        console.log('Sending PATCH request with data:', { name: editingTask.name }); // Debug log
        await api.patch(`/tasks/${editingTask.id}`, { name: editingTask.name });
        setEditingTask(null);
      } else {
        if (newTask.trim() === '') {
          alert('Task name is required');
          return;
        }

        console.log('Sending POST request with data:', { name: newTask }); // Debug log
        await api.post('/tasks', { name: newTask });
        setNewTask('');
      }
      handleFetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask(''); // Reset newTask field when editing
  };

  useEffect(() => {
    handleFetchTasks();
  }, []);

  const isSaveDisabled = () => {
    if (editingTask) {
      return editingTask.name.trim() === '';
    } else {
      return newTask.trim() === '';
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {tasks.map((task) => (
          <Box
            key={task.id}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
            gap={1}
            width="100%"
          >
            <TextField
              size="small"
              value={editingTask?.id === task.id ? editingTask.name : task.name}
              onChange={(e) => editingTask?.id === task.id && setEditingTask({ ...editingTask, name: e.target.value })}
              fullWidth
              sx={{ maxWidth: 350 }}
            />
            <Box>
              <IconButton color="success" onClick={() => handleEdit(task)}>
                <Check />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(task.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ))}
        <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
          <TextField
            size="small"
            value={editingTask ? editingTask.name : newTask}
            onChange={(e) => editingTask ? setEditingTask({ ...editingTask, name: e.target.value }) : setNewTask(e.target.value)}
            placeholder="Ajouter une tâche"
            fullWidth
            sx={{ maxWidth: 350 }}
          />
          <Button variant="outlined" onClick={handleSave} disabled={isSaveDisabled()}>
            {editingTask ? 'Modifier la tâche' : 'Ajouter une tâche'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
