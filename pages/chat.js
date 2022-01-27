import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI1NjA2MSwiZXhwIjoxOTU4ODMyMDYxfQ.4W4lBwzVB0PFPwRVlB452Kt3vyhrkaz8PGy6j9nluL0';
const SUPABASE_URL = 'https://ygmjsqdpcwjfcizxqpdh.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  const [message, setMessage] = React.useState('');
  const [messageList, setMessageList] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from('messages')
      .select('*')
      .then(({ data }) => {
        setMessageList(data);
      });
  }, []);
  
  function handleNewMessage(newMessage) {
    const message = {
      //id: messageList.length - 1,
      from: 'TedMartins',
      text: newMessage,
    };
    supabaseClient
      .from('messages')
      .insert([
        message
      ])
      .then(({ data }) => {
        setMessageList([
          data[0],
          ...messageList,
        ]);
      });
    
    setMessage('');
  }
  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList messages={messageList} />
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={message}
              onChange={(event) => {
                const value = event.target.value;
                setMessage(value);
              }}
              onKeyPress={(event) => {
                if(event.key === 'Enter') {
                  event.preventDefault();
                  handleNewMessage(message);
                }
              }}
              placeholder="Place your message here..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.messages.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
            borderRadius: '5px',
            padding: '6px',
            marginBottom: '12px',
            hover: {
            backgroundColor: appConfig.theme.colors.neutrals[700],
            }
          }}
          >
          <Box
            styleSheet={{
                marginBottom: '8px',
            }}
          >
            <Image
              styleSheet={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: '8px',
              }}
              src={`https://github.com/${message.from}.png`}
            />
            <Text tag="strong">
              {message.from}
            </Text>
            <Text
              styleSheet={{
                fontSize: '10px',
                marginLeft: '8px',
                color: appConfig.theme.colors.neutrals[300],
              }}
              tag="span"
            >
              {(new Date().toLocaleDateString())}
            </Text>
          </Box>
          {message.text}
          </Text>
        );
      })}
    </Box>
  )
}