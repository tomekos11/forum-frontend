resource "aws_ecs_task_definition" "tf_forum_frontend" {
  family                   = "tf-forum-frontend"
  cpu                      = "512"
  memory                   = "1024"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = "arn:aws:iam::380244861394:role/task-forum-frontend"
  task_role_arn            = "arn:aws:iam::380244861394:role/task-forum-frontend"

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture       = "X86_64"
  }
  
  container_definitions = jsonencode([
    {
      name      = "forum-frontend"
      image     = "380244861394.dkr.ecr.eu-north-1.amazonaws.com/tf/forum/frontend:${var.image_tag}"
      cpu       = 0
      memory    = null
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
          appProtocol   = "http"
          name          = "forum-frontend"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/forum-frontend"
          "awslogs-create-group"  = "true"
          "awslogs-region"        = "eu-north-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}