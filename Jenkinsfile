pipeline {
    agent any
    environment {
        PYTHON_ENV = 'venv'
    }
    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/Robeco945/Year2_SE1.git', branch: 'main'
            }
        }
        stage('Setup Python Environment') {
            steps {
                sh '''
                python3 -m venv $PYTHON_ENV
                source $PYTHON_ENV/bin/activate
                pip install --upgrade pip
                pip install -r requirements.txt
                '''
            }
        }
        stage('Run Unit Tests') {
            steps {
                sh '''
                source $PYTHON_ENV/bin/activate
                pytest --junitxml=reports/test-results.xml --cov=yourpackage --cov-report=html:reports/coverage
                '''
            }
            post {
                always {
                    junit 'reports/test-results.xml'
                    publishHTML(target: [
                        reportName: 'Coverage Report',
                        reportDir: 'reports/coverage',
                        reportFiles: 'index.html'
                    ])
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t yourproject:latest .'
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}