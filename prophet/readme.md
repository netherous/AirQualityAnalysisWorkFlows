# Workflow for running the analysis script

Prerequisites:
A running prometheus container, Python packages: pandas, plotly, prophet, prometheus-api-client

1. Change directory to this folder
2. Run the following sample command:

```console
python3 analysis.py -m NH3 CO2 -start 01/01/2021 -end 01/11/2021
```

3. This is should output the text analysis(summaries of metrics) in a .txt file called analysis.txt, and store the relevant plots (statistical analysis as well as predictions) in the /figures sub-directory
