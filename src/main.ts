import { bootstrapApplication } from '@angular/platform-browser';
import { TodoTaskDemo } from './app/todoTask';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Routes, provideRouter } from '@angular/router';

const routes: Routes = [];

bootstrapApplication(TodoTaskDemo, {
providers: [provideAnimationsAsync(), provideRouter(routes)],
}).catch((err) => console.error(err));