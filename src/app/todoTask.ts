import { Component, OnInit } from '@angular/core';
import { ImportsModule } from './imports';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'table-row-edit-demo',
    templateUrl: 'todoTask.html',
    styleUrls: ['todoTask.css'],
    standalone: true,
    imports: [ImportsModule],
    providers: [MessageService]
})
export class TodoTaskDemo implements OnInit {
    apiData: any[] = [];
    rowData: any = {};
    visible: boolean = false;
    loading: boolean = false;
    disableButton: boolean = false;
    taskForm: FormGroup;

    getUrl = 'https://freeapi.miniprojectideas.com/api/JWT/GetAllTaskList';
    postUrl = 'https://freeapi.miniprojectideas.com/api/JWT/CreateNewTask';
    deleteUrl = 'https://freeapi.miniprojectideas.com/api/JWT/DeleteTask';
    updateUrl = 'https://freeapi.miniprojectideas.com/api/JWT/UpdateTask';

    constructor(
        private messageService: MessageService,
        private http: HttpClient,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.fetchTasks();
        this.initializeForm();
    }

    // Initialize the form with validation
    initializeForm() {
        this.taskForm = this.fb.group({
            taskName: ['', [Validators.required]],
            taskDescription: ['', [Validators.required]],
            isCompleted: [false]
        });
    }

    fetchTasks() {
        this.loading = true;
        this.http.get(this.getUrl).subscribe((res: any) => {
            this.loading = false;
            if (res.result) {
                this.apiData = res.data;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data found' });
            }
        });
    }

    showDialog(task: any = null) {
        if (task) {
            this.rowData = { ...task };
            this.taskForm.patchValue(task);
        } else {
            this.rowData = { taskName: '', taskDescription: '', isCompleted: false };
            this.taskForm.reset();
        }
        this.visible = true;
    }

    onRowCreate() {
        this.showDialog();
    }

    onSave(taskForm) {
        if (taskForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
            return;
        }

        this.disableButton = true;
        const formData = this.taskForm.value;
        
        if (this.rowData?.itemId && this.rowData?.itemId !== 0) {
            // Update existing task
            this.http.put(this.updateUrl, { ...this.rowData, ...formData }).subscribe((res: any) => {
                    if (res.result) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: res?.message ? res?.message : 'Task Updated' });
                        this.visible = false;
                        this.disableButton = false;
                        this.fetchTasks();
                    }
                },
                () => {
                    this.disableButton = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update task' });
                }
            );
        } else {
            // Create new task
            this.rowData.itemId = 0;
            this.rowData.tags = 'string';
            this.rowData.isCompleted = formData.isCompleted;
            this.rowData.dueDate = new Date();
            this.rowData.createdOn = new Date();
            this.rowData.completedOn = new Date();
            this.http.post(this.postUrl, { ...this.rowData, ...formData }).subscribe((res: any) => {
                    if (res.result) {
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task Created' });
                        this.visible = false;
                        this.disableButton = false;
                        this.fetchTasks();
                    }
                },
                () => {
                    this.disableButton = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create task' });
                }
            );
        }
    }

    onRowDelete(task: any) {
        this.disableButton = true;
        const deleteUrlWithId = `${this.deleteUrl}?itemId=${task.itemId}`;
        this.http.delete(deleteUrlWithId).subscribe((res: any) => {
                if (res.result) {
                    this.fetchTasks();
                    this.disableButton = false;
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task Deleted' });
                }
            },
            () => {
                this.disableButton = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete task' });
            }
        );
    }
}
