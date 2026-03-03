pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Start Environment') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'docker-compose exec backend pytest --cov=. --cov-report=xml --cov-report=html --junitxml=pytest.xml'
            }
        }

	stage('Collect Coverage') {
    	    steps {
        	sh 'docker cp $(docker-compose ps -q backend):/app/htmlcov ./htmlcov'
    	    }
        }

	stage('Archive Coverage') {
    	    steps {
        	archiveArtifacts artifacts: 'htmlcov/**', fingerprint: true
    	    }
	}
    }

    post {
        always {
            sh 'docker-compose down -v'
        }
    }
}