import { ArrowUp, Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { WhatsappChat, WhatsappMessage } from "@/types/app";
import { obtainChats, obtainMessagesByChatId } from "@/api/chatService";
import clsx from "clsx";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Whatsapp() {
  //const [menuOpen, setMenuOpen] = useState(false);
  const { messages, sendMessage } = useWebSocket();
  const [chats, setChats] = useState<WhatsappChat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(
    chats[0] ?? null
  );
  const [messageText, setMessageText] = useState('');
  const [conversation, setConversation] = useState<WhatsappMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const fetchData = async () => {
       
        try {
          const accessToken = localStorage.getItem("auth_token");
          if (!accessToken) throw new Error('Token vacío');

          const chats = await obtainChats(accessToken);
          setChats(chats)
  
        } catch (error: any) {
          console.error(error?.message ?? 'Error al procesar consultas');
        }
        
      };
  
      fetchData();
    }, []);

    const filteredChats = chats
    .filter(chat => {
      if (!chat) return false;
      
      const search = searchTerm.toLowerCase();
      const nameMatch = chat.name?.toLowerCase().includes(search);
      const waIdMatch = chat.waId?.toString().includes(search);
      const messageMatch = chat.messages?.toLowerCase().includes(search);

      return nameMatch || waIdMatch || messageMatch;
    })
    .sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

   useEffect(() => {
      const accessToken = localStorage.getItem("auth_token");
      if (!accessToken || !selectedContact) {
        setConversation([]);
        return;
      }

      let isCancelled = false; // flag para cancelar la actualización si cambia el contacto

      const fetchData = async () => {
        try {
          const conv = await obtainMessagesByChatId(accessToken, selectedContact.id);
          if (!conv || isCancelled) return;

          // Clonar y ordenar sin mutar la respuesta original
          const sortedConv = [...conv].sort((a, b) => {
            if (!a.createdAt && !b.createdAt) return 0;
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });

          if (!isCancelled) setConversation(sortedConv);
        } catch (error) {
          if (!isCancelled) setConversation([]);
          console.error("Error al obtener mensajes:", error);
        }
      };

      fetchData();

      return () => {
        isCancelled = true; // marca la petición como cancelada si cambia selectedContact
      };
    }, [selectedContact]);


    // acortar palabras de un mesaje largo
    function cutOutWords(texto: string | undefined, maxPalabras: number = 8): string {
      if (!texto) return '';
      const words = texto.split(' ');
      return words.length > maxPalabras ? words.slice(0, maxPalabras).join(' ') + '…' : texto;
    }

    // manejo de envio de mensaje nuevo
    const handleSendMessage = () => {
      const now = new Date();
      if (messageText.trim() && conversation && selectedContact) {
        let newMessage = {
          id: crypto.randomUUID(),
          messageId: `wamid.${crypto.randomUUID()}`,
          messageFrom: 'dispatcher-human',
          body: messageText,
          type: 'text',
          status: 'pending',
          chatId: selectedContact?.id ?? '',
          filename: '',
          mimeType: '',
          senderId: '0ca30e3e-2509-45cd-9cfb-8794ed04bc24',
          senderName: 'maira',
          url: '',
          createdAt: localToUTCISO(now),
          updatedAt: localToUTCISO(now),
          loadId: 0,
          isBundle: false,
          questionNumber: 0
        };
        setConversation([ ...conversation, newMessage ]);
        const dataMessage = {
          type: 'message',
          userId: newMessage.chatId,
          chatMessage: newMessage
        };
        sendMessage(dataMessage);
        setMessageText('');

        const updateChat = chats.map(chat => {
            if (chat.id === newMessage.chatId) return {
              ...chat,
              messages: newMessage.body
            }
            return chat
          });
          setChats(updateChat);
      }
    };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.type === 'chat' ) {
        if (lastMessage.chat.id === selectedContact?.id) {
          const updateChat = chats.map(chat => {
            if (chat.id === lastMessage.chat.id) return lastMessage.chat
            return chat
          });
          setChats(updateChat);
        }
      }

      if (lastMessage.type === 'message') {
        if (lastMessage.chatMessage.chatId === selectedContact?.id) {
          setConversation([ ...conversation, lastMessage.chatMessage ])
        }
      }
    }
  }, [messages]);

  function localToUTCISO(date: Date): string {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  }


  return (
    <div className="flex h-full overflow-hidden rounded-2xl border border-gray-300 shadow-lg">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-300">
        {/* Sidebar Header */}
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-white focus:ring-1 focus:ring-green-accent text-white">
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-custom-text-disabled' />
            <Input
                placeholder='Search conversations...'
                value={ searchTerm }
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 bg-custom-background border-custom-border text-custom-text-primary'
            />
        </header>

        {/* Contact List */}
        <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
          {/* aquí puedes mapear contactos con un array */}
          {
            filteredChats.map(chat => chat ? (
              <div key={ chat.id } className={
                clsx(
                  "flex items-start mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md",
                  {
                    'bg-gray-200': selectedContact?.id === chat.id
                  }
                )
              } onClick={() => setSelectedContact(chat)} >
                <Avatar className='h-10 w-10 me-2'>
                  <AvatarImage src={ '' } alt={  chat.name } />
                  <AvatarFallback className='bg-custom-primary-accent text-black'>
                    { chat.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-start">
                  <h2 className="text-sm font-semibold">{ chat.name }</h2>
                  <p className="text-sm text-custom-text-secondary">{ cutOutWords(chat.messages) }</p>
                </div>
              </div>
            ) : null)
          }
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative">
        {/* Chat Header */}
        {
          selectedContact && (
            <header className="flex gap-2 bg-white p-4 text-gray-700">
              {/* <h1 className="text-2xl font-semibold">{ selectedContact?.name }</h1> */}
              <div className='relative'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={ '' } alt={ selectedContact?.name } />
                  <AvatarFallback className='bg-custom-primary-accent text-black'>
                    {selectedContact?.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-custom-surface' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <h3
                    className={`font-medium truncate text-black`}
                  >
                    { selectedContact?.name }
                  </h3>
                </div>
                <div className='flex items-center justify-between'>
                  <h3
                    className={`font-medium truncate text-xs text-custom-text-secondary`}
                  >
                    Online
                  </h3>
                </div>
              </div>
            </header>
          )
        }

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="h-screen overflow-y-auto p-4 pb-60">
          {/* aquí puedes mapear mensajes con un array */}

            {
              conversation ? conversation.map(message => {
                if (message.messageFrom === 'user' && message.type === 'text') {
                  {/* Incoming Message */}
                  return (
                    <div key={ message.id } className="flex flex-col mb-4 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-green-accent p-1 rounded-full">
                          <User className='w-4 h-4' />
                        </div>
                        <span className='text-absolute-black text-sm'>{message.senderName}</span>
                      </div>
                      <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3 text-start transition-all duration-200 hover:shadow-md py-3 border border-green-accent">
                          <p className="text-gray-700 text-sm whitespace-pre-wrap">{ message.body }</p>
                      </div>
                    </div>
                  )
                } 
                
                if ( (message.messageFrom === 'dispatcher-human' || message.messageFrom === 'assistant' || message.messageFrom === 'admin') && message.type === 'text' ){
                  {/* Outgoing Message */}
                  return (
                    <div key={ message.id } className="flex flex-col items-end mb-4 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <span className='text-absolute-black text-sm'>{message.senderName}</span>
                          <div className="bg-absolute-black p-1 rounded-full">
                            <User className='w-4 h-4 text-green-500' />
                          </div>
                        </div>
                        <div className="flex max-w-96 bg-absolute-black focus:ring-1 focus:ring-green-accent transition-all duration-200 hover:shadow-md text-white text-start rounded-lg p-3 gap-3">
                            <p className="whitespace-pre-wrap text-sm">{ message.body }</p>
                        </div>
                    </div>
                  )
                }

                return null
              }) : null
            }
        </div>

        {/* Chat Input */}
        {
          selectedContact && (
            <footer className="w-full bg-white border-t border-gray-300 p-4 absolute bottom-0">
              <div className="flex items-center">
                <input
                  type="text"
                  value={ messageText }
                  onChange={e => setMessageText(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button onClick={ handleSendMessage } className="bg-green-accent focus:ring-1 focus:ring-green-accent px-4 py-2 rounded-md ml-2">
                  <ArrowUp className='w-4 h-4' />
                </button>
              </div>
            </footer>
          )
        }
      </div>
    </div>
  );
}
