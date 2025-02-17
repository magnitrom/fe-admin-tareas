import { Component, Input } from '@angular/core';
import { TooltipModule } from 'ng2-tooltip-directive';

@Component({
  selector: 'app-required-char',
  imports: [TooltipModule],
  templateUrl: './required-char.component.html',
  styleUrl: './required-char.component.scss',  
  standalone: true
})
export class RequiredCharComponent {
  optionTooltips = {
    'placement': 'top',
    'showDelay': 5,
    'hideDelay': 5
  }

  @Input() msjTooltip: string;
  constructor(){
     this.msjTooltip = "Este campo es obligatorio."
  }
}
