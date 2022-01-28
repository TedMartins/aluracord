import React from 'react';
import appConfig from '../config.json';
import Head from 'next/head';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { BiSend } from 'react-icons/bi';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI1NjA2MSwiZXhwIjoxOTU4ODMyMDYxfQ.4W4lBwzVB0PFPwRVlB452Kt3vyhrkaz8PGy6j9nluL0';
const SUPABASE_URL = 'https://ygmjsqdpcwjfcizxqpdh.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function messageListener(addMessage) {
  return supabaseClient
  .from('messages')
  .on('INSERT', (liveAnswer) => {
    addMessage(liveAnswer.new);
  })
  .subscribe();
}

export default function ChatPage() {
  const router = useRouter();
  const signedUser = router.query.username;
  const [message, setMessage] = React.useState('');
  const [messageList, setMessageList] = React.useState([]);
  const pagetitle = `AluraCord - ${signedUser}`;

  React.useEffect(() => {
    supabaseClient
      .from('messages')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setMessageList(data);
      });

      const subscription = messageListener((newMessage) => {
        setMessageList((currentMessageList) => {
          return [
            newMessage,
            ...currentMessageList,
          ]
        });
      });

      return () => {
        subscription.unsubscribe();
      }
      
  }, []);
  
  function handleNewMessage(newMessage) {
    const message = {
      from: signedUser,
      text: newMessage,
    };
    supabaseClient
      .from('messages')
      .insert([
        message
      ])
      .then(({ data }) => {
        console.log(data);
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
      <Head>
        <title>{pagetitle}</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
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
              placeholder="Digite sua mensagem aqui..."
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
            <Button
              value={message}
              onClick={(event) => {
                event.preventDefault();
                {message.length > 2
                  ? handleNewMessage(message)
                  : alert('Por favor, digite uma mensagem maior.');
                }
              }}
              label={< BiSend />}
              styleSheet={{
                borderRadius: '50%',
                padding: '3px',
                minWidth: '50px',
                minHeight: '50px',
                fontSize: '25px',
                fontWeight: '800',
                marginBottom: '8px',
                marginRight: '15px',
                lineHeight: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[400],
                filter: 'opacity(100%);',
                hover: {
                  filter: 'opacity(75%);',
                }              
              }}
              buttonColors={{
                mainColorLight: appConfig.theme.colors.primary[400],
              }}
            />
            <ButtonSendSticker 
              onStickerClick={(sticker) => {
                handleNewMessage(`:sticker: ${sticker}`);
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

          {message.text.startsWith(':sticker:') 
          ? (
            <Image 
              src={message.text.replace(':sticker:', '')}
              styleSheet={{
                width: '125px',
                height: '125px',
              }}
            />
          ) 
          : (
            message.text
          )}
          </Text>
        );
      })}
    </Box>
  )
}