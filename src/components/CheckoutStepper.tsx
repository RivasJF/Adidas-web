import React from 'react';
import { useLocation } from 'react-router-dom';
import { Check, User, CreditCard, PartyPopper } from 'lucide-react';

const steps = [
  { path: '/checkout/datos', label: 'Datos Personales', icon: User },
  { path: '/checkout/pago', label: 'Método de Pago', icon: CreditCard },
  { path: '/checkout/confirmacion', label: 'Confirmación', icon: PartyPopper },
];

export const CheckoutStepper: React.FC = () => {
  const { pathname } = useLocation();
  const currentIndex = steps.findIndex((s) => s.path === pathname);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.path}>
                {/* Step */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${
                      isCompleted
                        ? 'bg-black text-white border-black'
                        : isActive
                        ? 'bg-white text-black border-black ring-4 ring-black/10'
                        : 'bg-gray-100 text-gray-400 border-gray-300'
                    }`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="hidden sm:block">
                    <p
                      className={`text-sm font-black uppercase tracking-wider ${
                        isActive ? 'text-black' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      Paso {index + 1} de {steps.length}
                    </p>
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-3 h-0.5 min-w-[1rem]">
                    <div
                      className={`h-full transition-colors ${
                        index < currentIndex ? 'bg-black' : 'bg-gray-200'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
