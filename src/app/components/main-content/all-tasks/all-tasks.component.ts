import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITask } from '../../../model/ITask';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../services/task.service';
import { faArrowsV } from '@fortawesome/free-solid-svg-icons/faArrowsV';


@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.scss'],
})
export class AllTasksComponent implements OnInit, OnDestroy {
  allTasks: ITask[];
  readonly dragArrowsV = faArrowsV;
  private tasksSubscription: Subscription;

  constructor(private taskService: TaskService) {
  }

  ngOnInit() {
    this.tasksSubscription = this.taskService.getAllTasks().subscribe(
      (tasks: ITask[]) => {
        this.allTasks = tasks;
      }
    );
  }

  dropTask(event: CdkDragDrop<ITask[]>, allTasks: ITask[]) {
    moveItemInArray(allTasks, event.previousIndex, event.currentIndex);
  }

  removeTask(task: ITask) {
    this.taskService.onTaskRemove(task.taskNumber);
  }

  ngOnDestroy() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  getCompletedTasksPercent(allTasks: ITask[]): number {
    const totalTasksCount = allTasks.length;
    if (totalTasksCount === 0) {
      return 100;
    }
    const completedTasksCount = allTasks.filter(task => task.isTaskCompleted).length;
    return (completedTasksCount / totalTasksCount) * 100;
  }
}
