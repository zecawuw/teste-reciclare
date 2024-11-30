import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Importação para o Dayjs
import dayjs from "dayjs";
import "dayjs/locale/pt-br"; // Importa o locale para o Brasil

// Configura o locale para pt-br (Brasil)
dayjs.locale("pt-br");

const AdicionarNoticia = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    data_publicacao: "",
    publicado: false,
    data_limite_popup: "",
    ativo: true,
    motivo_inativacao: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/noticias", formData);
      alert("Notícia adicionada com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao adicionar notícia:", error);
      alert("Erro ao adicionar notícia!");
    }
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
        flexDirection:"column",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Adicionar Notícia
      </Typography>

      <TextField
        fullWidth
        label="Título"
        name="titulo"
        value={formData.titulo}
        onChange={handleChange}
        margin="normal"
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            sx={{
                marginTop: "10px"
            }}
          label="Data de Publicação"
          value={dayjs(formData.data_publicacao)}
          onChange={(newValue) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              data_publicacao: newValue ? newValue.format("YYYY-MM-DD") : "",
            }));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            sx={{
            marginTop: "18px"
            }}
          label="Data Limite do POP-UP"
          value={dayjs(formData.data_limite_popup)}
          onChange={(newValue) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              data_limite_popup: newValue ? newValue.format("YYYY-MM-DD") : "",
            }));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <FormControlLabel
        sx={{
            marginTop: "18px"
            }}
        control={
          <Checkbox
            checked={formData.publicado}
            onChange={handleChange}
            name="publicado"
          />
        }
        label="Publicado?"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.ativo}
            onChange={handleChange}
            name="ativo"
          />
        }
        label="Ativo?"
      />

      <TextField
        fullWidth
        label="Motivo de Inativação"
        name="motivo_inativacao"
        value={formData.motivo_inativacao}
        onChange={handleChange}
        margin="normal"
        disabled={formData.ativo} // Desabilita se "ativo" for true
      />

      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Adicionar Notícia
        </Button>
      </Box>
    </Box>
  );
};

export default AdicionarNoticia;
