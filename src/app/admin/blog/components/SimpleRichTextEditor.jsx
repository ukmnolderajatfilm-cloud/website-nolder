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
      .replace(/^---$/gim, '<hr class="my-6 border-t border-dashed border-gray-600" />')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full h-auto rounded-lg my-4" />')
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
        
        {/* Floating action buttons */}
        {showButtons && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 right-4 flex items-center space-x-2 bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-600 z-50"
            style={{ zIndex: 9999 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                console.log('Image button clicked');
                fileInputRef.current?.click();
              }}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
              title="Add Image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={addNewPart}
              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
              title="Add New Part"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                console.log('H2 button clicked');
                addHeading(2);
              }}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
              title="Add H2"
            >
              <span className="text-xs font-bold">H2</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                console.log('H3 button clicked');
                addHeading(3);
              }}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
              title="Add H3"
            >
              <span className="text-xs font-bold">H3</span>
            </motion.button>
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
