// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {
        nextId = 1
    } else {
        nextId++
    }
    localStorage.setItem("nextId", JSON.stringify(nextId))

    return nextId

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $(`<div>`)
      .addClass(`card task-card draggable my-3`)
      .attr(`data-task-id`, task.id);
    const cardHeader = $(`<div>`).addClass(`card-header h2`).text(task.title);
    const cardBody =   $(`<div>`).addClass(`card-body`);
    const cardDescription = $('<p>').addClass('card-text').text(task.description)
  const cardDueDate = $('<p>').addClass('card-text').text(task.deadlineDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);
if(task.dueDate && task.status !==`done`){
const now = dayjs();
const taskDueDate = dayjs(task.deadlineDate,`DD/MM/YYYY`);
if(now.isSame(taskDueDate,`day`)){
    taskCard.addClass(`bg-warning text-white`);
}
 else if (now.isAfter(taskDueDate,`day`))  {
    taskCard.addclass(`bg-danger text-white`);
    cardDeleteBtn.addClass(`border-light`);
    
 } 
    



}
cardBody.append(cardDescription,cardDueDate,cardDeleteBtn)
taskCard.append(cardHeader,cardBody)
return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
          
    const todoList = $(`#todo-cards`)
    const inProgressList = $(`#in-progress-cards`)
    const DoneList = $(`#done-cards`)
    todoList.empty()
    inProgressList.empty()
    DoneList.empty()
  for(let task of taskList) {
    if (task.status ===`to-do`) {
        todoList.append(createTaskCard(task));
    }   else if (task.status === `in-progress`){
        inProgressList.append(createTaskCard(task));
    }    else if(task.status === `done`){
        DoneList.append(createTaskCard(task));
    }
}
$(`.draggable`).draggable({
    opacity: 0.7,
    zIndex: 100,
    helper:function(event){
    const original = $(event.target).hasClass(`ui-draggable`)
    ?$(event.target) : $(event.target).closest(`.ui-draggable`)
    return original.clone().css({
        maxWidth: original.outerWidth()
    })

    }
})
    
  



}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault()
    // title, description, deadline date, id, status
    const task = {
        id: generateTaskId(),
        title: $(`#taskTitle`).val(),
        description: $(`#taskDescription`).val(),
        deadlineDate: $(`#taskDueDate`).val(),
        status: 'to-do'
    }
    taskList.push(task)
    localStorage.setItem('tasks', JSON.stringify(taskList))

    $(`#taskTitle`).val('')
    $(`#taskDescription`).val('')
    $(`#taskDueDate`).val('')
    $(`#formModal`).modal(`hide`)
    renderTaskList()
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault()
const taskId = $(this).attr(`data-task-id`);
taskList.forEach((task)=>{
if(task.id===parseInt(taskId)){
    taskList.splice(taskList.indexOf(task),1)
}
})
localStorage.setItem(`tasks`,JSON.stringify(taskList))
renderTaskList()

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
const taskId = ui.draggable[0].dataset.taskId
console.log(taskId)

const newTaskStatus = event.target.id
console.log(newTaskStatus)
for(let task of taskList){
    console.log(task.id)
if(task.id=== parseInt(taskId)){

task.status=newTaskStatus
}
}
localStorage.setItem(`tasks`,JSON.stringify(taskList))
renderTaskList()
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $('#taskForm').on('submit', handleAddTask)
    renderTaskList()
    $(`.lane`).droppable({
      accept:".draggable",
       drop:handleDrop
    })
});
