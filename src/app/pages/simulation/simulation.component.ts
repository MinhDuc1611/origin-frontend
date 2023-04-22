import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {

  public amount: string = '0';
  public reachDate: Date = new Date();
  public monthlyAmount: number = 0;
  public totalMonths: number = 0;
  public isReachDayFocused: boolean = true;

  ngOnInit () {
    this.onNextMonth();
  }

  /**
  * Get name of month by index
  */
  getMonthName(index: number) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ]

    return months[index];
  }

  /**
  * Handle when click arrow 'Left'
  */
  onPrevMonth() {
    if (this.reachDate.getMonth() === 0) {
      this.reachDate.setMonth(11);
      this.reachDate.setFullYear(this.reachDate.getFullYear() - 1);
    } else {
      this.reachDate.setMonth(this.reachDate.getMonth() - 1);
    }

    this.calcMonthlyAmount();
  }

  /**
  * Handle when click arrow 'Left'
  */
  onNextMonth() {
    this.reachDate.setMonth(this.reachDate.getMonth() + 1);

    this.calcMonthlyAmount();
  }

  /**
  * 
  */
  checkDisabledPrevMonth() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return this.reachDate.getTime() <= date.getTime();
  }

  /**
  * Handle when typing input 'Total amount'
  */
  onInput(event: any) {
    const regex: RegExp = new RegExp(/^(?!\.)\d*\.?\d{0,2}$/g);
    const inputVal = event.target.value.replaceAll(',', '')
    if (!String(inputVal).match(regex)) {
      event.target.value = this.amount;
      return;
    };

    const regexVal = inputVal.match(regex)[0];
    if (!regexVal.endsWith('.')) {
      event.target.value = this.amount = this.formatValue(Number(regexVal), regexVal.includes('.'));
    } else {
      this.amount = event.target.value;
    }

    this.calcMonthlyAmount();
  }

  formatValue(value: number, isDecimal?: boolean) {
    return value.toLocaleString(undefined, { 
      minimumFractionDigits: isDecimal ? 1 : 0,
      maximumFractionDigits: 2
    })
  }

  /**
  * Calculate monthtly amount 
  */
  calcMonthlyAmount() {
    this.totalMonths = this.calcTotalMonths();
    this.monthlyAmount =  parseFloat(this.amount.replaceAll(',', '') || '0') / this.totalMonths;
  }

  /**
  * Calculate total months
  */
  calcTotalMonths() {
    const date = new Date();
    const monthsByYear = (this.reachDate.getFullYear() - date.getFullYear()) * 12;
    const month = (this.reachDate.getMonth() - date.getMonth());
    return monthsByYear + month;
  }

  /**
  * Handle when focus on 'Reach goal by'
  */
  onFocusReachDate(event: FocusEvent) {
    this.isReachDayFocused = true;
  }

  /**
  * Handle when moves the focus away from 'Reach goal by'
  */
  onBlurReachDate(event: FocusEvent) {
    this.isReachDayFocused = false;
  }

  onConfirm(f: NgForm) {
    if (!this.amount) return;

    Swal.fire(
      '',
      'Your plan had been set successfully.',
      'success'
    )
  }

  /**
  * Handle when typing arrow key on the keyboard
  */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.isReachDayFocused) {
      if (event.key === 'ArrowLeft' && !this.checkDisabledPrevMonth()) {
        this.onPrevMonth();
      } else if (event.key === 'ArrowRight') {
        this.onNextMonth();
      }
    }
  }
}
