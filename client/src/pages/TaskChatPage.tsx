import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Task, ChatMessage } from '../types';
import { StatusChip } from '../components/ui/StatusChip';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import {
  Send,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const TaskChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchTaskAndMessages = async () => {
    if (!id) return;
    try {
      const taskData = await api.getTaskById(id);
      setTask(taskData);
      const msgData = await api.getTaskMessages(id);
      setMessages(msgData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskAndMessages();

    const socket = getSocket();
    socket.emit('join:task', id);

    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('message:new', handleNewMessage);

    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string, actionType?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !id) return;

    try {
      const newMsg = await api.sendTaskMessage(id, {
        text,
        actionType,
      });
      // Append if not caught by socket
      setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
      setInputText('');
    } catch (err: any) {
      alert(`Chat error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F5F2EC] min-h-screen py-12 text-center text-xs font-mono">
        Connecting to task chat...
      </div>
    );
  }

  return (
    <div className="bg-[#F5F2EC] min-h-screen py-6 flex flex-col">
      <div className="max-w-3xl mx-auto px-4 w-full flex-1 flex flex-col">
        {/* Header Bar */}
        <div className="bg-surface border border-line rounded-t-[10px] p-4 flex items-center justify-between shadow-clean">
          <div className="flex items-center gap-3">
            <Link
              to={task ? `/helper/tasks/${task.id}` : '/explore'}
              className="p-1.5 hover:bg-[#F5F2EC] rounded-[4px] text-ink-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-ink truncate max-w-[240px] sm:max-w-md">
                  {task?.request?.title || 'Task Coordination'}
                </h2>
                <StatusChip status={task?.status || 'ACCEPTED'} size="sm" />
              </div>
              <p className="text-[11px] font-mono text-ink-muted">
                {task?.request?.locationText} • ETA: {task?.etaMinutes || 15} min
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-brand flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Encrypted Mesh</span>
          </div>
        </div>

        {/* Quick Action Chips from PRD */}
        <div className="bg-[#FAF8F5] border-x border-b border-line px-4 py-2.5 flex flex-wrap gap-2 text-xs font-mono">
          <span className="text-[10px] uppercase text-ink-muted self-center mr-1">
            Quick Actions:
          </span>
          <button
            onClick={() => handleSendMessage('Updated ETA: En route, will arrive in ~8 minutes.', 'ETA_UPDATE')}
            className="px-2.5 py-1 bg-white hover:bg-brand-light border border-line rounded-[4px] text-ink hover:text-brand transition-colors flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span>ETA: ~8 min</span>
          </button>

          <button
            onClick={() => handleSendMessage("I've arrived at College Lab 3 entrance with battery kit.", 'ARRIVED_NOTICE')}
            className="px-2.5 py-1 bg-white hover:bg-brand-light border border-line rounded-[4px] text-ink hover:text-brand transition-colors flex items-center gap-1"
          >
            <Navigation className="w-3 h-3" />
            <span>I've Arrived at Lab</span>
          </button>

          <button
            onClick={() => handleSendMessage('Please check Lab 3 door - technician has arrived.', 'LOCATION_PING')}
            className="px-2.5 py-1 bg-white hover:bg-brand-light border border-line rounded-[4px] text-ink hover:text-brand transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            <span>Ping Door Access</span>
          </button>
        </div>

        {/* Message History Area */}
        <div className="flex-1 bg-surface border-x border-line p-4 overflow-y-auto min-h-[380px] max-h-[500px] space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-ink-muted font-mono text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand" />
              <span>Direct mesh channel opened. Send ETA or coordinate tools below.</span>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.senderId === user?.id;

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted mb-0.5">
                    <span>{m.sender?.name || (isMine ? 'You' : 'Participant')}</span>
                    <span>•</span>
                    <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`max-w-[80%] rounded-[8px] px-3.5 py-2 text-xs leading-relaxed ${
                      isMine
                        ? 'bg-brand text-white'
                        : 'bg-[#F5F2EC] text-ink border border-line'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="bg-surface border border-line rounded-b-[10px] p-3 shadow-clean">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message, coordination note, or tool update..."
              className="flex-1 px-3.5 py-2 text-xs bg-[#F5F2EC] border border-line rounded-[6px] focus:outline-none focus:border-brand"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-[6px] flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
