import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import swal from 'sweetalert'

import { Header } from '../../components';

import api from '../../services/api';
import ibge from '../../services/ibge';

import './style.scss'

interface Item {
  id: number;
  title: string;
  image: string;
}

interface UF {
  id: number;
  sigla: string;
  nome: string;
}

interface City {
  id: number;
  nome: string;
}

interface FormPoint {
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  latitude: number;
  longitude: number;
  items: number[];
}

const initialForm: FormPoint = {
  name: '',
  email: '',
  whatsapp: '',
  uf: '0',
  city: '',
  latitude: -26.907451,
  longitude: -49.079378,
  items: [],
}

const CreatePoint: React.FC = () => {
  const history = useHistory()

  const [items, setItems] = useState<Item[]>([])
  const [ufs, setUfs] = useState<UF[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
  
  const [form, setForm] = useState<FormPoint>(initialForm)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      
      setInitialPosition([ latitude, longitude ])
    })
  }, [])

  useEffect(() => {
    async function loadItems() {
      const { data } = await api.get('/items')

      setItems(data)
    }

    loadItems()
  }, [])

  useEffect(() => {
    async function loadUfs() {
      const { data } = await ibge.get('/')

      setUfs(data)
    }

    loadUfs()
  }, [])

  useEffect(() => {
    async function loadCities() {
      if (form.uf === '0') {
        return;
      }

      const { data } = await ibge.get(`/${form.uf}/municipios`)

      setCities(data)
    }

    loadCities()
  }, [form.uf])

  const renderItems = () => (
    items.map((item) => (
      <li
        key={item.id}
        className={form.items.includes(item.id) ? 'selected' : ''}
        onClick={() => handleSelectedItem(item.id)}
      >
        <img src={item.image} alt={item.title} />
        <span>{item.title}</span>
      </li>
    ))
  )

  const ufOptions = () => (
    ufs.map((uf) => (
      <option key={uf.id} value={uf.sigla}>
        {uf.sigla} - {uf.nome}
      </option>
    ))
  )

  const cityOptions = () => (
    cities.map((city) => (
      <option key={city.id} value={city.nome}>
        {city.nome}
      </option>
    ))
  )

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target
    
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleText = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleMapClick = (event: LeafletMouseEvent) => {
    const { lat: latitude, lng: longitude } = event.latlng
    setForm({
      ...form,
      latitude,
      longitude
    })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await api.post('/points', { ...form })
  
      await swal('Show!', 'Ponto de coleta cadastrado com sucesso!', 'success');

      history.push('/')
    } catch (error) {
      swal('Oppss', 'Algo de errado não está certo! Verifique os campos e tente novamente', 'error')
    }
  }

  const handleSelectedItem = (id: number) => {
    const itemHasSelected = form.items.includes(id)

    const newListItems = itemHasSelected
      ? form.items.filter(item => item !== id) 
      : [...form.items, id]

    setForm({
      ...form,
      items: newListItems
    })
  }

  return (
    <div id="page-create-point">
      <Header>
        <Link to="/">
          <FiArrowLeft /> 
          Voltar
        </Link>
      </Header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do<br />
          pondo de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>

            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleText}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>

              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleText}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>

              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                value={form.whatsapp}
                onChange={handleText}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={initialPosition}
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[form.latitude, form.longitude]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>

              <select
                name="uf"
                id="uf"
                value={form.uf}
                onChange={handleSelect}
              >
                <option value="0">Selecione uma UF</option>
                {ufOptions()}
              </select>
              
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>

              <select
                name="city"
                id="city"
                value={form.city}
                onChange={handleSelect}
              >
                <option value="0">Selecione uma cidade</option>
                {cityOptions()}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {renderItems()}
          </ul>
        </fieldset>

        <button type="submit">
          Cadastrar ponto de coleta
        </button>

      </form>
    </div>
  );
}

export default CreatePoint;