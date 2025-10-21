'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SimpleRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "tulis ketikan mu disini"
}) {
  const [showButtons, setShowButtons] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleContentChange = (e) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Let Enter work normally for new lines
    if (e.key === 'Enter') {
      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    }
  };

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Insert image URL at cursor position
        const currentValue = value || '';
        const beforeCursor = currentValue.substring(0, cursorPosition);
        const afterCursor = currentValue.substring(cursorPosition);
        const imageMarkdown = `\n\n![Image](${data.url})\n\n`;
        
        const newValue = beforeCursor + imageMarkdown + afterCursor;
        onChange(newValue);
        
        // Focus back to textarea and set cursor after image
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            const newCursorPos = beforeCursor.length + imageMarkdown.length;
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            setCursorPosition(newCursorPos);
          }
        }, 100);
      } else {
        alert('Failed to upload image: ' + data.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const addNewPart = () => {
    const currentValue = value || '';
    const beforeCursor = currentValue.substring(0, cursorPosition);
    const afterCursor = currentValue.substring(cursorPosition);
    const separator = '\n\n---\n\n';
    
    const newValue = beforeCursor + separator + afterCursor;
    onChange(newValue);
    
    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = beforeCursor.length + separator.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPosition(newCursorPos);
      }
    }, 100);
  };

  const addHeading = (level) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = value || '';
    
    // Get selected text
    let selectedText = '';
    let beforeText = '';
    let afterText = '';
    
    if (start === end) {
      // No text selected, insert heading at cursor
      selectedText = 'Heading Text';
      beforeText = currentValue.substring(0, start);
      afterText = currentValue.substring(end);
    } else {
      // Text is selected
      selectedText = currentValue.substring(start, end);
      beforeText = currentValue.substring(0, start);
      afterText = currentValue.substring(end);
    }
    
    // Remove existing heading markers
    const cleanText = selectedText.replace(/^#+\s*/, '').trim();
    
    // Add heading marker
    const headingMarker = level === 2 ? '## ' : '### ';
    const newHeading = headingMarker + cleanText;
    
    // Construct new value
    const newValue = beforeText + newHeading + afterText;
    onChange(newValue);
    
    // Focus back to textarea and select the heading text
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newStart = beforeText.length + headingMarker.length;
        const newEnd = newStart + cleanText.length;
        textareaRef.current.setSelectionRange(newStart, newEnd);
        setCursorPosition(newEnd);
      }
    }, 100);
  };

  const handleBold = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, end + 2);
      }, 0);
    }
  };

  const handleItalic = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, end + 1);
      }, 0);
    }
  };

  const handleUnderline = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText = value.substring(0, start) + `<u>${selectedText}</u>` + value.substring(end);
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 3, end + 3);
      }, 0);
    }
  };

  const handleAlign = (alignment) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      
      // Wrap selected text with alignment div
      const alignClass = alignment === 'left' ? 'text-left' : 
                        alignment === 'center' ? 'text-center' : 
                        alignment === 'right' ? 'text-right' : 'text-justify';
      
      const newText = value.substring(0, start) + `<div class="${alignClass}">${selectedText}</div>` + value.substring(end);
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        const newStart = start + `<div class="${alignClass}">`.length;
        const newEnd = newStart + selectedText.length;
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // Function to render markdown preview
  const renderMarkdownPreview = (text) => {
    if (!text) return '';
    
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-semibold text-white my-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-white my-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-white my-5">$1</h1>')
      .replace(/^---$/gim, '<hr class="my-6 border-t border-dashed border-gray-600" />')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full h-auto rounded-lg my-4" />')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline">$1</u>')
      .replace(/<div class="text-(left|center|right|justify)">(.*?)<\/div>/g, '<div class="text-$1">$2</div>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      
      <div 
        className="relative group"
        onMouseEnter={() => {
          console.log('Mouse enter');
          setShowButtons(true);
        }}
        onMouseLeave={() => {
          console.log('Mouse leave');
          setShowButtons(false);
        }}
      >
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          onFocus={() => {
            console.log('Textarea focused');
            setShowButtons(true);
          }}
          onBlur={(e) => {
            // Delay hiding to allow button clicks
            setTimeout(() => {
              console.log('Textarea blurred');
              setShowButtons(false);
            }, 200);
          }}
          placeholder={placeholder}
          className="w-full text-lg text-white placeholder-gray-500 border-none outline-none resize-none bg-transparent min-h-[500px]"
          style={{ minHeight: '500px' }}
        />
        
        {/* Microsoft Word Style Floating Toolbar */}
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-300 z-50 overflow-hidden"
            style={{ zIndex: 9999 }}
          >
            {/* Toolbar Header */}
            <div className="bg-gray-100 px-3 py-1 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-600">Formatting</span>
            </div>
            
            {/* Toolbar Content */}
            <div className="p-2">
              {/* Font Formatting Row */}
              <div className="flex items-center space-x-1 mb-2">
                {/* Bold */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBold}
                  className="p-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                  title="Bold"
                >
                  <span className="text-sm font-bold">B</span>
                </motion.button>
                
                {/* Italic */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleItalic}
                  className="p-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                  title="Italic"
                >
                  <span className="text-sm italic">I</span>
                </motion.button>
                
                {/* Underline */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUnderline}
                  className="p-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                  title="Underline"
                >
                  <span className="text-sm underline">U</span>
                </motion.button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Image */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                  title="Add Image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Headings Row */}
              <div className="flex items-center space-x-1 mb-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addHeading(1)}
                  className="px-3 py-1 text-xs font-bold text-gray-700 hover:bg-purple-100 rounded transition-colors"
                  title="Heading 1"
                >
                  H1
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addHeading(2)}
                  className="px-3 py-1 text-xs font-bold text-gray-700 hover:bg-purple-100 rounded transition-colors"
                  title="Heading 2"
                >
                  H2
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addHeading(3)}
                  className="px-3 py-1 text-xs font-bold text-gray-700 hover:bg-purple-100 rounded transition-colors"
                  title="Heading 3"
                >
                  H3
                </motion.button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addNewPart}
                  className="p-2 text-gray-700 hover:bg-green-100 rounded transition-colors"
                  title="Add Separator"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Text Alignment Row */}
              <div className="flex items-center space-x-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAlign('left')}
                  className="p-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                  title="Align Left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h12M3 12h18M3 16h12" />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAlign('center')}
                  className="p-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                  title="Align Center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M3 12h18M6 16h12" />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAlign('right')}
                  className="p-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                  title="Align Right"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M9 8h12M3 12h18M9 16h12" />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAlign('justify')}
                  className="p-2 text-gray-700 hover:bg-blue-100 rounded transition-colors"
                  title="Justify"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18M3 12h18M3 16h18" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Live Preview */}
      {value && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Live Preview:</h4>
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(value) }}
          />
        </div>
      )}
    </div>
  );
}
