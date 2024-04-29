import React from 'react';
import { ModalBackdrop, ModalContent } from '../styled/ModalStyles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalBackdrop>
  );
}
