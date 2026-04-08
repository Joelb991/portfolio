import argparse
import pandas as pd
from gurobipy import Model, GRB, quicksum
import os

# --- OPTIMIZATION FUNCTION ---
def optimize(inputfile, outputfile, M_min, M_max):
    """
    Optimization logic using Gurobi.
    Accepts dynamic M_min and M_max from the GUI.
    """
    print("--- Starting Optimization Process ---")
    print(f"Input File: {os.path.basename(inputfile)}")
    print(f"Constraints: Min Modules={M_min}, Max Modules={M_max}")

    # 1. Read Data
    print("Reading Excel sheets...")
    pref_df     = pd.read_excel(inputfile, sheet_name = 'Preference',      index_col=0)
    page_df     = pd.read_excel(inputfile, sheet_name = 'Page Weight',     index_col=0)
    size_df     = pd.read_excel(inputfile, sheet_name = 'Percentage Size', index_col=0)
    max_size_df = pd.read_excel(inputfile, sheet_name = 'Module Max Size', index_col=0)

    # 2. Setup Model
    print("Setting up Gurobi model...")
    mod = Model()
    I = pref_df.columns
    J = pref_df.index
    K = size_df.index
    P = page_df.index

    w = page_df['Weight']
    l = max_size_df['max_size'] # max percentage for each module

    Z = mod.addVars(I,K,P, vtype=GRB.BINARY, name='z')

    mod.setObjective(sum(Z[i,k,p]*pref_df.loc[j,i]*w[p] for i in I for j in J for k in K for p in P), GRB.MAXIMIZE)

    # Constraint 1: Each module can only appear once
    for i in I:
        mod.addConstr(sum(Z[i,k,p] for k in K for p in P) <= 1, name='c1')

    # Constraint 2: Module cannot exceed max size
    for k in K:
        mod.addConstr(quicksum(Z[i,k,p] for i in I for p in P if k > l[i]) == 0, name='c2')

    # Constraint 3: Sizes on one page must add up to at most 1
    for p in P:
        mod.addConstr(sum(Z[i,k,p]*k for i in I for k in K) <= 1.0, name='c3')

    # Constraint 4: Recommendation module must be on Page 1
    if 'R' in I:
        mod.addConstr(quicksum(Z['R', k, 1] for k in K) == 1, name='c4')

    # Constraint 5: Min/Max modules per page
    for p in P:
        mod.addConstr(sum(Z[i,k,p] for i in I for k in K) <= M_max, name = 'c5_1')
        mod.addConstr(sum(Z[i,k,p] for i in I for k in K) >= M_min, name = 'c5_2')

    # 3. Solve
    print("Optimizing...")
    mod.optimize()

    # 4. Process Results
    if mod.Status == GRB.OPTIMAL:
        print(f"Optimization successful! Objective Value: {mod.objVal}")

        solutionX_df = pd.DataFrame(0, index=I, columns=K)
        for i, k, p in Z:
            if Z[i,k,p].X == 1:
                solutionX_df.loc[i,k] = 1

        solutionY_df = pd.DataFrame(0, index=I, columns=P)
        for i,k,p in Z:
            if Z[i,k,p].x == 1:
                solutionY_df.loc[i,p] = 1

        objective_df = pd.DataFrame([mod.objVal], columns=['Maximum Preference Score'])

        print(f"Saving results to: {outputfile}")
        writer = pd.ExcelWriter(outputfile)
        objective_df.to_excel(writer, sheet_name='objective', index=False)
        solutionX_df.to_excel(writer, sheet_name='module_size_assignment')
        solutionY_df.to_excel(writer, sheet_name='module_page_assignment')
        writer.close()
        print("Done.")
    else:
        print("Optimization did not find an optimal solution.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Command line interface to scheduler")
    parser.add_argument("input_file", help="Input Excel file")
    parser.add_argument("output_file", help="Output Excel file")
    args = parser.parse_args()
    optimize(args.input_file, args.output_file)
