import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Para navegação após salvar
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Importação corrigida
import dayjs from "dayjs";
import "dayjs/locale/pt-br"; // Importa o locale para o Brasil
import axios from "axios";

// Configura o locale para pt-br (Brasil)
dayjs.locale("pt-br");

const Editar = () => {
  const { id } = useParams(); // Obtém o ID da rota
  const navigate = useNavigate(); // Função para redirecionar após salvar
  const [noticia, setNoticia] = useState({
    titulo: "",
    data_publicacao: "",
    publicado: false,
    data_limite_popup: "",
    ativo: true,
    data_inativacao: "",
    motivo_inativacao: "",
  });

  // Carrega os dados da notícia ao montar o componente
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/noticias/${id}`) // Certifique-se de que esta URL esteja correta
      .then((response) => {
        setNoticia(response.data); // Preenche o formulário com os dados recebidos
      })
      .catch((error) => {
        console.error("Erro ao carregar a notícia:", error);
        alert("Erro ao carregar os dados da notícia.");
      });
  }, [id]);

  // Atualiza os dados do formulário ao digitar ou alterar os campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNoticia((prevNoticia) => ({
      ...prevNoticia,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Envia os dados atualizados para o servidor
  const handleSave = () => {
    axios
      .put(`http://localhost:8000/api/noticias/${id}`, noticia) // Certifique-se de que esta URL esteja correta
      .then((response) => {
        alert("Notícia atualizada com sucesso!");
        navigate("/"); // Redireciona para a lista de notícias
      })
      .catch((error) => {
        console.error("Erro ao salvar a notícia:", error);
        alert("Erro ao atualizar a notícia.");
      });
  };

  return (
    <Box
      sx={{
        maxWidth: "90%",
        width: "100%",
        margin: "auto",
        padding: 3,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "black",
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Editar Notícia
      </Typography>

      <TextField
        fullWidth
        label="Título"
        name="titulo"
        value={noticia.titulo}
        onChange={handleChange}
        margin="normal"
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            marginTop: "10px",
          }}
          label="Data da Publicação"
          value={dayjs(noticia.data_publicacao)}
          onChange={(newValue) => {
            setNoticia((prevNoticia) => ({
              ...prevNoticia,
              data_publicacao: newValue ? newValue.format("YYYY-MM-DD") : "",
            }));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            marginTop: "18px",
          }}
          label="Data Limite do POP-UP"
          value={noticia.data_limite_popup ? dayjs(noticia.data_limite_popup) : null} // Condicional para garantir valor válido
          onChange={(newValue) => {
            setNoticia((prevNoticia) => ({
              ...prevNoticia,
              data_limite_popup: newValue ? newValue.format("YYYY-MM-DD") : "",
            }));
          }}
          renderInput={(params) => <TextField {...params} sx={{ marginTop: 20 }} />}
        />
      </LocalizationProvider>

      <FormControlLabel
        control={
          <Checkbox
            checked={noticia.publicado}
            onChange={handleChange}
            name="publicado"
          />
        }
        label="Publicado?"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={noticia.ativo}
            onChange={handleChange}
            name="ativo"
          />
        }
        label="Ativo?"
      />

      <TextField
        fullWidth
        label="Motivo da Inativação"
        name="motivo_inativacao"
        value={noticia.motivo_inativacao}
        onChange={handleChange}
        margin="normal"
        disabled={noticia.ativo} // Desabilita se "ativo" for true
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            marginTop: "18px",
          }}
          label="Data da Inativação"
          value={dayjs(noticia.data_inativacao)}
          onChange={(newValue) => {
            setNoticia((prevNoticia) => ({
              ...prevNoticia,
              data_inativacao: newValue ? newValue.format("YYYY-MM-DD") : "",
            }));
          }}
          renderInput={(params) => <TextField {...params} />}
          disabled={noticia.ativo} // Desabilita se "ativo" for true
        />
      </LocalizationProvider>

      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
          Salvar
        </Button>
      </Box>
    </Box>
  );
};

export default Editar;
