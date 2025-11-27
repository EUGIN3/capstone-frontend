import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AxiosInstance from '../../API/AxiosInstance';
import React, {useEffect, useState} from 'react';

export default function ImageListComponents() {
  const [attires, setAttires] = useState([]);

  const fetchAttires = async () => {
    try {
      const response = await AxiosInstance.get('/gallery/attire/'); // user view endpoint
      setAttires(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch attires');
    }
  };

  useEffect(() => {
    fetchAttires();
  }, []);

  useEffect(() => {
    console.log(attires)
  }, [attires])

  return (
    <Box>
      <ImageList variant="masonry" cols={4} gap={6}>
        {attires.map((item) => (
          <ImageListItem key={item.image1}>
            <img
              srcSet={`${item.image1}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.image1}?w=248&fit=crop&auto=format`}
              alt={item.attire_name}
              loading="lazy"
            />


            <ImageListItemBar position="below" title={item.attire_name} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
    title: 'Bed',
  },
  {
    img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
    title: 'Books',
  },
  {
    img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    title: 'Sink',
  },
  {
    img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
    title: 'Kitchen',
  },
  {
    img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
    title: 'Blinds',
  },
  {
    img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
    title: 'Chairs',
  },
  {
    img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
    title: 'Laptop',
  },
  {
    img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    title: 'Doors',
  },
  {
    img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
    title: 'Storage',
  },
  {
    img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
    title: 'Candle',
  },
  {
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    title: 'Coffee table',
  },
];