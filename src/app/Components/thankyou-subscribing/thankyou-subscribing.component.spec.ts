import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThankyouSubscribingComponent } from './thankyou-subscribing.component';

describe('ThankyouSubscribingComponent', () => {

  let component: ThankyouSubscribingComponent;
  let fixture: ComponentFixture<ThankyouSubscribingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThankyouSubscribingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankyouSubscribingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});