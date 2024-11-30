import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Modal, Fade, Backdrop } from '@mui/material';
import { Link } from 'react-router-dom';

const Lista = () => {
  const [noticias, setNoticias] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupNoticia, setPopupNoticia] = useState(null);

  useEffect(() => {
    // Requisição para buscar as notícias
    axios.get('http://localhost:8000/api/noticias') // URL da API Laravel
      .then(response => {
        console.log('Dados recebidos:', response.data); // Log para depuração
        setNoticias(response.data);
      })
      .catch(error => {
        console.error('Erro ao carregar as notícias:', error);
      });
  }, []);

  const handleAtivoChange = (id, ativo) => {
    axios.put(`http://localhost:8000/api/noticias/${id}`, { ativo: !ativo }) // Atualiza o status de ativo
      .then(response => {
        setNoticias(noticias.map(noticia => 
          noticia.id === id ? { ...noticia, ativo: !ativo } : noticia
        ));
      })
      .catch(error => {
        console.error('Erro ao alterar o status da notícia:', error);
      });
  };

  const handleReativar = (id) => {
    axios.put(`http://localhost:8000/api/noticias/${id}/reativar`) // Rota para reativar
      .then(response => {
        setNoticias(noticias.map(noticia => 
          noticia.id === id ? { ...noticia, ativo: true } : noticia
        ));
      })
      .catch(error => {
        console.error('Erro ao reativar a notícia:', error);
      });
  };

  const handlePopupOpen = (noticia) => {
    setPopupNoticia(noticia);
    setOpenPopup(true);
  };

  const handlePopupClose = () => {
    setOpenPopup(false);
    setPopupNoticia(null);
  };

  // Função para verificar se a data_limite_popup já passou ou está próxima
  const isPopupActive = (dataLimite) => {
    if (!dataLimite) return false;
    const currentDate = new Date();
    const limiteDate = new Date(dataLimite);
    return limiteDate <= currentDate;  // Exibe popup se a data limite for anterior ou igual à data atual
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '90%', margin: 'auto', padding: 3, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: 'black' }}>
      <Typography variant="h4" gutterBottom>
        Lista de Notícias
      </Typography>
      {/* Botão para Adicionar Nova Notícia */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/adicionar"
        sx={{ marginBottom: 3 }}
      >
        Adicionar Nova Notícia
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Data da Publicação</TableCell>
              <TableCell>Data Limite Popup</TableCell>
              <TableCell>Publicado?</TableCell>
              <TableCell>Ativo?</TableCell>
              <TableCell>Data Limite (Inativação)</TableCell> {/* Alteração aqui */}
              <TableCell>Motivo da Inativação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noticias.map((noticia) => (
              <TableRow key={noticia.id}>
                <TableCell>{noticia.id}</TableCell>
                <TableCell>{noticia.titulo}</TableCell>
                <TableCell>{noticia.data_publicacao || '—'}</TableCell>
                <TableCell>{noticia.data_limite_popup || '—'}</TableCell>
                <TableCell>{noticia.publicado ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={noticia.ativo}
                    onChange={() => handleAtivoChange(noticia.id, noticia.ativo)}
                  />
                </TableCell>
                <TableCell>{noticia.data_inativacao || '—'}</TableCell>
                <TableCell>{noticia.motivo_inativacao || '—'}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" component={Link} to={`/editar/${noticia.id}`}>
                    Editar
                  </Button>
                  {!noticia.ativo && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleReativar(noticia.id)}
                      sx={{ display: "flex", flexDirection:"column", width: "auto", marginTop: "10px", }}
                    >
                      Reativar
                    </Button>
                  )}
                  {/* Se data_limite_popup já passou, abre o popup */}
                  {isPopupActive(noticia.data_limite_popup) && (
                    <Button variant="contained" color="error" onClick={() => handlePopupOpen(noticia)}>
                      Exibir Popup
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup Modal */}
      <Modal
        open={openPopup}
        onClose={handlePopupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openPopup}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: 400, 
            backgroundColor: 'white', 
            padding: 3, 
            borderRadius: 2 
          }}>
            <Typography variant="h6" gutterBottom>
              Alerta de Inativação
            </Typography>
            <Typography>
              A notícia <strong>{popupNoticia?.titulo}</strong> tem uma data limite de inativação: {popupNoticia?.data_limite_popup}.
            </Typography>
            <Button variant="contained" color="secondary" onClick={handlePopupClose} sx={{ marginTop: 2 }}>
              Fechar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Lista;
