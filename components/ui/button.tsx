import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-primary text-background shadow-[0_15px_40px_rgba(255,75,113,0.35)] hover:opacity-90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_10px_30px_rgba(95,76,255,0.35)]',
        accent:
          'bg-accent text-accent-foreground hover:bg-accent/80 shadow-[0_10px_30px_rgba(0,245,255,0.4)]',
        outline:
          'border border-white/15 bg-transparent text-foreground hover:bg-white/5',
        ghost: 'text-muted-foreground hover:text-white hover:bg-white/5',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'bg-gradient-primary text-background shadow-[0_20px_45px_rgba(255,154,60,0.35)]',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
